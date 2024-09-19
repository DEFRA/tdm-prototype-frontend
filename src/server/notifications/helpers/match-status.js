function matchStatusElementListItem({ match }) {
  return {
    kind: 'tag',
    value: match.matched ? 'Matched' : 'No Match',
    classes: match.matched ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

export { matchStatusElementListItem }
