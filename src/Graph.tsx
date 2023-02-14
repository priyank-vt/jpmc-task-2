import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  private elem: PerspectiveViewerElement | undefined;
  private table: Table | undefined;

  render() {
    return <perspective-viewer id="perspective-viewer"></perspective-viewer>;
  }

  componentDidMount() {
    this.elem = document.getElementById('perspective-viewer') as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.elem && this.table) {
      this.elem.setAttribute('view', 'y_line');
      this.elem.setAttribute('column-pivots', '["stock"]');
      this.elem.setAttribute('row-pivots', '["timestamp"]');
      this.elem.setAttribute('columns', '["top_ask_price"]');
      this.elem.setAttribute('aggregates', `
        {"stock": "distinct count",
         "top_ask_price": "avg",
         "top_bid_price": "avg",
         "timestamp": "distinct count"}`);
      this.elem.load(this.table);
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(this.props.data.map((el: ServerRespond) => ({
        stock: el.stock,
        top_ask_price: el.top_ask && el.top_ask.price || 0,
        top_bid_price: el.top_bid && el.top_bid.price || 0,
        timestamp: el.timestamp,
      })));
    }
  }
}

export default Graph;
