import React, { Component } from "react"
import loadable from "@loadable/component"
import Loader from "./Loader"
import { Router, Link } from "@reach/router"

import Text from "./Text"

const PageA = loadable(() => import("./page/PageA"), {
  fallback: Loader,
})
const PageB = loadable(() => import("./page/PageB"), {
  fallback: Loader,
})
const PageC = loadable(() => import("./page/PageC"), {
  fallback: Loader,
})

import { injectGlobal } from "emotion"

injectGlobal`
  body {
    padding: 0;
    margin: 0;
  }
`

export default class App extends Component {
  state = {
    count: 0,
  }
  componentDidMount() {
    this.incremement()
    setInterval(this.incremement, 3000)
  }
  incremement = () => {
    this.setState(state => ({ count: state.count + 1 }))
  }
  render() {
    return (
      <div>
        <Text>Has been edited: 1</Text>
        <Text>App content: {this.state.count}</Text>
        <Link to="/">Page A</Link>
        <Link to="/b">Page B</Link>
        <Link to="/c">Page C</Link>
        <Router>
          <PageA path="/" />
          <PageA path="/a" />
          <PageB path="/b" />
          <PageC path="/c" />
        </Router>
      </div>
    )
  }
}
