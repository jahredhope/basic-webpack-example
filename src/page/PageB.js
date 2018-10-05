import React, { Component } from "react"

import Text from "../Text"

export default class PageB extends Component {
  state = {
    showMore: false,
  }
  componentDidMount() {
    console.log("MOUNT", "PageB")
  }
  handleShowMore = () => {
    this.setState({ showMore: true })
  }
  render() {
    return (
      <div>
        <h3 onClick={this.handleShowMore}>Page B</h3>
        <Text>Things</Text>
        {this.state.showMore && <Text>More</Text>}
      </div>
    )
  }
}
