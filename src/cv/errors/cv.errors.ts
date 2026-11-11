export const CV_ERRORS = {
  NOT_FOUND: (id: number) => `Cv d'id ${id} introuvable.`,
  NOT_OWNER: 'Vous ne pouvez modifier ou supprimer que vos propres cvs.',
} as const;