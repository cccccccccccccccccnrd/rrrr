export const useContent = () =>
  useState('content', () => {
    return {
      pages: {},
      current: {}
    }
  })