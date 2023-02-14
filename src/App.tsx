import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

interface IState {
  data: ServerRespond[],
  showGraph: boolean, // Add showGraph property to state
}

class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false, // Set showGraph to false
    };
  }

  renderGraph() {
    // Only render the Graph component when showGraph is true
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    }
  }

  getDataFromServer() {
    let intervalCount = 0;
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({
          data: serverResponds,
          showGraph: true, // Show the Graph component once we receive data
        });
      });
      intervalCount++;
      if (intervalCount > 1000) {
        clearInterval(interval);
      }
    }, 100);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
