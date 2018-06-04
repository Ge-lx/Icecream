function project (original, projection) {
  if (projection === null || original === null) return original
  let input = Object.assign({}, original)
  if (projection.hasOwnProperty('except') && projection.hasOwnProperty('only')) { // That is XNOR
    throw new Error('You cannot mix inclusive and exclusive projections')
  }
  let zeroes = projection.except || []
  let ones = projection.only || []
  let move = projection.move || {}

  zeroes.forEach(key => {
    delete input[key]
  })
  if (ones.length > 0) {
    let output = {}
    ones.forEach(key => {
      if (!input.hasOwnProperty(key)) throw new Error(`Property ${key} not found in projection source`)
      output[key] = input[key]
    })
    input = output
  }
  for (let key in move) {
    if (!input.hasOwnProperty(key)) throw new Error(`Property ${key} not found in projection source`)
    input[move[key]] = input[key]
    delete input[key]
  }
  return input
}

export default (input, projection) => {
  if (Array.isArray(input)) {
    let out = []
    input.forEach(obj => out.push(project(obj, projection)))
    return out
  } else return project(input, projection)
}
