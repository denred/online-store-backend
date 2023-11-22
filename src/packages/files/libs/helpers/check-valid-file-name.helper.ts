const checkValidFileName = (fileName: string): boolean => {
  return /^\w(?:[\w .-]*\w)?\.[\w-]+$/.test(fileName);
};

export { checkValidFileName };
