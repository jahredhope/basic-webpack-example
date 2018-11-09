import React, { Component } from "react"
import Loadable from "react-loadable"
import Loader from "./Loader"
import { Router, Link } from "@reach/router"

import Text from "./Text"

const PageA = Loadable({
  loader: () => import("./page/PageA"),
  loading: Loader,
})
const PageB = Loadable({
  loader: () => import("./page/PageB"),
  loading: Loader,
})
const PageC = Loadable({
  loader: () => import("./page/PageC"),
  loading: Loader,
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
          <PageB path="/b" />
          <PageC path="/c" />
        </Router>
      </div>
    )
  }
}
