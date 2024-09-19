// TODO : Where can we put this for re-use?
function matchStatusElementListItem({ match }) {
  return {
    kind: 'tag',
    value: match.matched ? 'Matched' : 'No Match',
    classes: match.matched ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

export { matchStatusElementListItem }
