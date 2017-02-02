import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import * as mcActions from '../actions/mcActions';

const unitSize = 45


let mouseMoveListener = (e, startValue, startY, rowIndex, colIndex, callback) => {
  let dy = parseFloat((startY - e.pageY) / 50)
  if (isNaN(dy)) {dy = 0}
  callback(rowIndex, colIndex, startValue + dy)
  return
}

const MatrixRow = ({rowIndex, pi, y, cellCallback}) => {
  let rows = pi.map((value, colIndex) => {
    let onMouseDown = (e) => {
      e.preventDefault()
      e.stopPropagation()

      let startY = e.nativeEvent.pageY
      let anonymousFunc = (e) => mouseMoveListener(e, value, startY, rowIndex, colIndex, cellCallback)
      window.addEventListener('mousemove', anonymousFunc , false);
      window.addEventListener('mouseup', (e) => {
        e.preventDefault()
        e.stopPropagation()
        window.removeEventListener('mousemove', anonymousFunc)
        return
      })
    }
    
    return (
      <g
        key={y + "" + colIndex}
        transform={`translate(${unitSize * colIndex + unitSize/2}, ${y + unitSize/2})`}
        onMouseDown={ onMouseDown }
      >
        <rect
          x={-unitSize/2}
          y={-unitSize/2}
          width={unitSize}
          height={unitSize}
          stroke="black"
          strokeWidth="2"
          fill="white"
        ></rect>
        <text textAnchor="middle" dominantBaseline="central">
          {Math.floor(value * 1000) / 1000}
        </text>
      </g>
      )
  })

  return (<g>
    { rows }
  </g>)
}
MatrixRow.propTypes = {
  pi: PropTypes.array.isRequired,
  y: PropTypes.number.isRequired
}

const Matrix = ({ mat, updateProba, updateReward, removeState }) => {
  let nbRows = mat.length
    , nbCols = Array.isArray(mat[0]) ? mat[0].length : 0
    , buttons, rows
  if (nbCols === 0) {
    nbCols = mat.length
    nbRows = 1
    rows = <MatrixRow rowIndex={0} pi={mat} y={0} cellCallback={updateReward} />
    buttons = []
  } else {
    rows = mat.map((pi, i) => {
      return (
        <MatrixRow key={i} rowIndex={i} pi={pi} y={unitSize * i} cellCallback={updateProba} />
      )
    })

    buttons = (
      <div style={{float:"left"}}>
        { mat.map((pi, i) => {
          return (
            <Button style={{display:"block", height:unitSize}} key={i} bsSize="xsmall" type="button" 
              onClick={ (e) => removeState(e, i) }>
              -
            </Button>
          )
        }) }
      </div>
    )
  }

  return (
    <div>
      { buttons }
      <svg width={unitSize * nbCols} height={unitSize * nbRows}>
        <g className="matrix">
          { rows }
        </g>
      </svg>  
    </div>
    
  )
}
Matrix.propTypes = {
  mat: PropTypes.array.isRequired
}

// function mapStateToProps(state){
//   return {
//   }
// }

function mapDispatchToProps(dispatch){
  return {
    updateProba: (i, j, value) => {
      dispatch(mcActions.updateProba(i, j, value))
    },
    updateReward: (i, j, value) => {
      dispatch(mcActions.updateReward(j, value))
    },
    removeState: (e, i) => {
      e.preventDefault()
      dispatch(mcActions.removeState(i))
    }
  }
}

export default connect(null, mapDispatchToProps)(Matrix);
