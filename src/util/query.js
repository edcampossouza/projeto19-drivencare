export function buildWhereClause(conditions) {
  const varArray = [];
  let index = 0;
  let str = "";
  for (const condition of conditions) {
    index++;
    str += index === 1 ? "WHERE " : " AND ";
    str += ` ${condition.column} ${condition.operator} $${index} `;
    varArray.push(condition.variable);
  }
  return {
    str,
    varArray: varArray.length === 0 ? undefined : varArray,
  };
}
