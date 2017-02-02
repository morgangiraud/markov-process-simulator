import React, { PureComponent, PropTypes } from 'react';

class History extends PureComponent {
  constructor(){
    super()

    this.textElements = []
    this.firstText = null
  }

  componentDidUpdate() {
    let currentX = this.firstText.getComputedTextLength()
    this.textElements.forEach((textElement) => {
      if (textElement) {
        textElement.setAttribute("x", currentX)
        currentX += textElement.getComputedTextLength() + 1
      }
    })
  }

  render() {
    this.textElements = Array(this.props.history.length)
    return (
      <g 
        transform={this.props.transformString}
      >
      <text
        ref={(firstText) => { this.firstText = firstText }}
        dominantBaseline="central"
        stroke="none"
      >
        H:  
      </text>
       { this.props.history.slice(-24).map((event, key) => {
          return (
            <text
              ref={(textEl) => { this.textElements[key] = textEl; } }
              key={key}
              dominantBaseline="central"
              stroke="none"
              fill={event.stroke}
            >
            { event.value + ", "}
            </text>
          )
        })}
    </g>  
    );
  }
  
}

History.propTypes = {
  history: PropTypes.array.isRequired,
  transformString: PropTypes.string
}

export default History;

