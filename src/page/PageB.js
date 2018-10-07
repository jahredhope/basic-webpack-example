import React, { Component } from "react"
import styled from "react-emotion"
import md5 from "md5"

import Text from "../Text"

const PixelContainer = styled("div")`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const Pixel = styled("div")`
  height: 100px;
  width: 100px;
  background-color: #${({ color }) => md5(color).substr(0, 6)};
`

export default class PageB extends Component {
  state = {
    showMore: false,
    indexStart: 1,
  }
  componentDidMount() {
    console.log("MOUNT", "PageB")
    this.unsubscribe = setTimeout(this.increment, 10000)
  }
  componentWillUnmount() {
    clearTimeout(this.unsubscribe)
  }
  increment = () => {
    this.setState(state => ({ indexStart: state.indexStart + 1 }))
    clearTimeout(this.unsubscribe)
    this.unsubscribe = setTimeout(this.increment, 10000)
  }
  handleShowMore = () => {
    this.setState({ showMore: true })
  }
  render() {
    const pixels = []
    for (let i = 0; i < 200; i++) {
      pixels.push(<Pixel color={i * this.state.indexStart}> </Pixel>)
    }
    return (
      <div>
        <h3 onClick={this.handleShowMore}>Page B</h3>
        <Text>Things and stuff</Text>
        {this.state.showMore && <Text>More</Text>}
        <PixelContainer>{pixels}</PixelContainer>
      </div>
    )
  }
}
