// insert_node merge_node move_node remove_node split_node set_node
export function createUpdateOperation(id, arg) {
  return createOperation("update", { id, ...arg });
}

export function createDelOperation(id) {
  return createOperation("delete", { id });
}

export function createOperation(type, arg) {
  return {
    type,
    arg,
  };
}
