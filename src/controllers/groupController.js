import Group from '../models/Group.js';

// @desc    Créer un groupe
// @route   POST /api/groups
// @access  Private
export const createGroup = async (req, res, next) => {
  try {
    const { name, description, icon, coverPhoto, type, allowMembersToPost, allowMembersToCreateEvents, administrators } = req.body;

    // L'utilisateur connecté est toujours un administrateur
    const adminsList = administrators && administrators.length > 0 
      ? [...new Set([...administrators, req.user._id.toString()])] 
      : [req.user._id];

    const group = await Group.create({
      name,
      description,
      icon,
      coverPhoto,
      type,
      allowMembersToPost: allowMembersToPost !== undefined ? allowMembersToPost : true,
      allowMembersToCreateEvents: allowMembersToCreateEvents !== undefined ? allowMembersToCreateEvents : false,
      administrators: adminsList,
      members: [req.user._id], // Le créateur est aussi membre
      createdBy: req.user._id
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('administrators', 'firstName lastName email profilePicture')
      .populate('members', 'firstName lastName email profilePicture')
      .populate('createdBy', 'firstName lastName email profilePicture');

    res.status(201).json({
      success: true,
      message: 'Groupe créé avec succès',
      data: populatedGroup
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir tous les groupes
// @route   GET /api/groups
// @access  Private
export const getAllGroups = async (req, res, next) => {
  try {
    const { search, type, limit = 20, page = 1 } = req.query;
    
    let query = {};

    // Ne montrer que les groupes publics ou ceux dont l'utilisateur est membre
    query.$or = [
      { type: 'public' },
      { members: req.user._id },
      { administrators: req.user._id }
    ];

    // Recherche par nom ou description
    if (search) {
      query.$and = [{
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }];
    }

    // Filtrer par type
    if (type) {
      query.type = type;
    }

    const groups = await Group.find(query)
      .populate('administrators', 'firstName lastName email profilePicture')
      .populate('createdBy', 'firstName lastName email profilePicture')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Group.countDocuments(query);

    // Ajouter le nombre de membres pour chaque groupe
    const groupsWithCount = groups.map(group => ({
      ...group.toObject(),
      membersCount: group.members.length
    }));

    res.status(200).json({
      success: true,
      data: {
        groups: groupsWithCount,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un groupe par ID
// @route   GET /api/groups/:id
// @access  Private
export const getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('administrators', 'firstName lastName email profilePicture')
      .populate('members', 'firstName lastName email profilePicture')
      .populate('createdBy', 'firstName lastName email profilePicture');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Groupe non trouvé'
      });
    }

    // Vérifier l'accès aux groupes privés et secrets
    if (group.type !== 'public') {
      const isMember = group.members.some(member => member._id.toString() === req.user._id.toString());
      const isAdmin = group.administrators.some(admin => admin._id.toString() === req.user._id.toString());

      if (!isMember && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé à ce groupe'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un groupe
// @route   PUT /api/groups/:id
// @access  Private
export const updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Groupe non trouvé'
      });
    }

    // Vérifier si l'utilisateur est administrateur
    const isAdmin = group.administrators.some(admin => admin.toString() === req.user._id.toString());

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Seuls les administrateurs peuvent modifier ce groupe'
      });
    }

    const { name, description, icon, coverPhoto, type, allowMembersToPost, allowMembersToCreateEvents } = req.body;

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { name, description, icon, coverPhoto, type, allowMembersToPost, allowMembersToCreateEvents },
      { new: true, runValidators: true }
    ).populate('administrators', 'firstName lastName email profilePicture')
     .populate('members', 'firstName lastName email profilePicture');

    res.status(200).json({
      success: true,
      message: 'Groupe mis à jour avec succès',
      data: updatedGroup
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un groupe
// @route   DELETE /api/groups/:id
// @access  Private
export const deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Groupe non trouvé'
      });
    }

    // Seul le créateur peut supprimer le groupe
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Seul le créateur peut supprimer ce groupe'
      });
    }

    await Group.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Groupe supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter un membre à un groupe
// @route   POST /api/groups/:id/members
// @access  Private
export const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Groupe non trouvé'
      });
    }

    // Pour les groupes privés et secrets, seuls les admins peuvent ajouter des membres
    if (group.type !== 'public') {
      const isAdmin = group.administrators.some(admin => admin.toString() === req.user._id.toString());
      
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Seuls les administrateurs peuvent ajouter des membres'
        });
      }
    }

    // Vérifier si l'utilisateur est déjà membre
    if (group.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Cet utilisateur est déjà membre'
      });
    }

    group.members.push(userId);
    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate('members', 'firstName lastName email profilePicture');

    res.status(200).json({
      success: true,
      message: 'Membre ajouté avec succès',
      data: updatedGroup
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retirer un membre d'un groupe
// @route   DELETE /api/groups/:id/members/:userId
// @access  Private
export const removeMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Groupe non trouvé'
      });
    }

    // Un utilisateur peut se retirer lui-même ou un admin peut retirer quelqu'un
    const isAdmin = group.administrators.some(admin => admin.toString() === req.user._id.toString());
    const isSelf = userId === req.user._id.toString();

    if (!isAdmin && !isSelf) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    // Empêcher la suppression d'un administrateur par cette route
    if (group.administrators.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de retirer un administrateur via cette route'
      });
    }

    group.members = group.members.filter(m => m.toString() !== userId);
    await group.save();

    res.status(200).json({
      success: true,
      message: 'Membre retiré avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter un administrateur à un groupe
// @route   POST /api/groups/:id/administrators
// @access  Private
export const addAdministrator = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Groupe non trouvé'
      });
    }

    // Seul un administrateur existant peut ajouter un nouvel administrateur
    const isAdmin = group.administrators.some(admin => admin.toString() === req.user._id.toString());

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Seuls les administrateurs peuvent ajouter d\'autres administrateurs'
      });
    }

    // Vérifier si l'utilisateur est déjà administrateur
    if (group.administrators.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Cet utilisateur est déjà administrateur'
      });
    }

    // Ajouter comme admin et membre si pas déjà membre
    group.administrators.push(userId);
    if (!group.members.includes(userId)) {
      group.members.push(userId);
    }
    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate('administrators', 'firstName lastName email profilePicture');

    res.status(200).json({
      success: true,
      message: 'Administrateur ajouté avec succès',
      data: updatedGroup
    });
  } catch (error) {
    next(error);
  }
};
