export const TODO_ERRORS = {
  NAME_REQUIRED: 'Le nom du todo est obligatoire.',
  NAME_MIN_LENGTH: 'Le nom doit contenir au moins 3 caractères.',
  NAME_MAX_LENGTH: 'Le nom ne peut pas dépasser 10 caractères.',
  DESCRIPTION_REQUIRED: 'La description du todo est obligatoire.',
  DESCRIPTION_MIN_LENGTH: 'La description doit contenir au moins 10 caractères.',
  STATUS_INVALID: 'Le statut doit être todo, in_progress ou done.',
  NOT_FOUND: 'Le todo demandé n\'existe pas.',
  NOT_DELETED: 'Restauration impossible : le todo n\'est pas supprimé.',
} as const;