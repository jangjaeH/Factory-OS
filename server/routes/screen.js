export const screenRoute = (id, title, sections) => ({
  method: 'GET', path: `/api/${id}`, protected: true,
  handle: () => ({ id, title, sections }),
})
