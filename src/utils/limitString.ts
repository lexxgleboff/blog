function limitString(str: string, num = 200) {
  return str?.length > num ? `${str.slice(0, num)}...` : str
}

export default limitString
