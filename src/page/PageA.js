import React, { Component } from "react"

const values = "abcdefghijklmnopqrstuvwxyz"

export default class PageA extends Component {
  componentDidMount() {
    console.log("MOUNT", "PageA")
  }
  render() {
    return (
      <div>
        <h3>Page A</h3>
        <ul>
          {values.split("").map((val, index) => (
            <li key={index}>
              {index} - {val}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
