export const validationErrorsFormatter = (validationErrors) => {
  const messages = {};
  if (validationErrors.length) {
    validationErrors.map((item) => {
      const objKeys = Object.keys(item.constraints);
      const messagesArr = [];
      objKeys.map((constraint, i) => {
        messagesArr.push(item.constraints[constraint]);
      });
      messages[item.property] = {
        massages: messagesArr
      };
    });
  }
  return messages;
};
