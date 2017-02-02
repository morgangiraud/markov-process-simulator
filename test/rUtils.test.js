import rUtils from '../src/rUtils'

describe("rUtils - syncValueEvaluationStep", () => {
    it('should compute the values of all nodes', function(){
        let states = [{"seed": "0"}, {"seed": "1"}]
        let P = [
            [1, 0],
            [0.5, 0.5]
        ]
        let rewards = [1, 0.5]
        let gamma = 1
        let currentValues = [0, 0]
        let [ newValues, currentDiff ] = rUtils.syncValueEvaluationStep(currentValues, P, rewards, gamma, true)
        
        expect(newValues).toEqual([1, 0.5])
        expect(currentDiff).toEqual(0.75)
    })
})

describe("rUtils - syncValueEvaluation", () => {
    it('should compute the values of all nodes', function(){
        let states = [{"seed": "0"}, {"seed": "1"}]
        let P = [
            [1, 0],
            [0.5, 0.5]
        ]
        let rewards = [1, 0.5]
        let gamma = 1
        let horizon = Infinity
        let epsilon = 1e-2
        let currentValues = [0, 0]
        let newValues = rUtils.syncValueEvaluation(currentValues, P, rewards, gamma, horizon, epsilon)
        
        expect(newValues).toEqual([1, 1.988])
    })  
    it('should compute the values of all nodes', function(){
        let states = [{"seed": "0"}, {"seed": "1"}]
        let P = [
            [1, 0],
            [0.5, 0.5]
        ]
        let rewards = [1, 0.5]
        let gamma = 0
        let horizon = Infinity
        let epsilon = 1e-2
        let currentValues = [0, 0]
        let newValues = rUtils.syncValueEvaluation(currentValues, P, rewards, gamma, horizon, epsilon)
        
        expect(newValues).toEqual([1, 0.5])
    })  
    it('should compute the values of all nodes', function(){
        let states = [{"seed": "0"}, {"seed": "1"}]
        let P = [
            [1, 0],
            [0.5, 0.5]
        ]
        let rewards = [1, 0.5]
        let gamma = 1
        let horizon = 0
        let epsilon = 1e-2
        let currentValues = [0, 0]
        let newValues = rUtils.syncValueEvaluation(currentValues, P, rewards, gamma, horizon, epsilon)
        
        expect(newValues).toEqual([1, 0.5])
    })  
    it('should compute the values of all nodes', function(){
        let states = [{"seed": "0"}, {"seed": "1"}]
        let P = [
            [1, 0],
            [0.5, 0.5]
        ]
        let rewards = [1, 0.5]
        let gamma = 1/2
        let horizon = Infinity
        let epsilon = 1e-2
        let currentValues = [0, 0]
        let newValues = rUtils.syncValueEvaluation(currentValues, P, rewards, gamma, horizon, epsilon)
        
        expect(newValues).toEqual([1, 0.998])
    })
    it('should compute the values of all nodes', function(){
        let states = [{"seed": "0"}, {"seed": "1"}]
        let P = [
            [0.5, 0.5],
            [0.5, 0.5]
        ]
        let rewards = [1, 0.5]
        let gamma = 0.99
        let horizon = Infinity
        let epsilon = 1e-2
        let currentValues = [0, 0]
        let newValues = rUtils.syncValueEvaluation(currentValues, P, rewards, gamma, horizon, epsilon)
        
        expect(newValues).toEqual([74.264, 73.764])
    })
})
