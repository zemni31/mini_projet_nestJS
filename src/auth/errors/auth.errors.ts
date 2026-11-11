export const AUTH_ERRORS = {
  USERNAME_REQUIRED: 'Le nom d\'utilisateur est obligatoire.',
  USERNAME_MIN_LENGTH: 'Le nom d\'utilisateur doit contenir au moins 3 caractères.',
  USERNAME_MAX_LENGTH: 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères.',
  PASSWORD_REQUIRED: 'Le mot de passe est obligatoire.',
  PASSWORD_MIN_LENGTH: 'Le mot de passe doit contenir au moins 8 caractères.',
  EMAIL_REQUIRED: 'L\'email est obligatoire.',
  EMAIL_INVALID: 'L\'email n\'est pas valide.',
  USER_ALREADY_EXISTS: 'Nom d\'utilisateur ou email déjà utilisé.',
} as const;