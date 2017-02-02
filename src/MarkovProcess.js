import * as d3Force from "d3-force";
import * as d3Collection from "d3-collection";
import mathjs from 'mathjs'

import utils from './utils'

export class MarkovChain {
    constructor(states, P) {
        // Config
        this.type = "mp"
        
        // Markov process
        this.states = utils.checkStates(states)
        this.P = utils.checkP(P)
        if(this.states.length !== this.P.length){
            throw new Error("You should have as many states as rows in the transition matrix")
        }
        this.det = mathjs.det(this.P)

        // Feel the force
        this.linkDistance = 90 * Math.sqrt(this.states.length)
        this.nodes = MarkovChain.buildNodes(this.states)
        this.links = MarkovChain.buildLinks(this.P, this.nodes)
        let terminalStates = utils.findTerminalStates(this.links)
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            if (terminalStates.indexOf(this.nodes[i]) !== -1) {
                this.nodes[i].data.terminal = true
            } else {
                this.nodes[i].data.terminal = false
            } 
        }

        // Simulation to position nodes
        let simulation = d3Force.forceSimulation()
        simulation.nodes(d3Collection.values(this.nodes))
        simulation.force("charge", d3Force.forceManyBody().strength(-50))
            .force("qcenter", d3Force.forceCenter(0, 0))
            .force("link", d3Force.forceLink(this.links).distance(() => this.linkDistance))
        for (let i = 0; i < 300; i++) {
            simulation.tick()
        }
    }
    static buildNodes(states){
        return states.map((state, i) => {
            return { data: state }
        });
    }
    static buildLinks(P, nodes){
        let links = []
        P.forEach(function(pi, i){
            pi.forEach(function(p, j){
                if (p === 0){
                    return
                }
                links.push({
                    source: nodes[i],
                    target: nodes[j],
                    p: p,
                    class: 'link'
                })
            })
        })
        return links
    }
    update(newState){
        return new MarkovChain(
            utils.isDefined(newState.states) ? newState.states : this.states
          , utils.isDefined(newState.P) ? newState.P : this.P
        )
    }
    export(){
        return btoa(JSON.stringify({
            states: this.states,
            P: this.P
        }))
    }
}

export class MarkovRewardProcess extends MarkovChain {
    constructor(states, P, rewards, gamma, horizon, epsilon) {
        super(states, P)

        this.type = "mrp"
        this.rewardRadius = 10

        // Markov reward process
        this.rewards = utils.checkRewards(rewards, this.states.length)
        this.gamma = utils.checkGamma(gamma)
        this.horizon = utils.checkHorizon(horizon)
        this.epsilon = utils.checkEpsilon(epsilon)

        this.nodes = MarkovRewardProcess.addRewardsToStates(this.nodes, this.rewards)
    }

    static addRewardsToStates(nodes, rewards) {
        if (!Array.isArray(rewards)){
            throw new Error("rewards must be an array")
        } 
        // Filling missing rewards with 0 values
        if (rewards.length !== nodes.length) {
            if (nodes.length > rewards.length) {
                while(nodes.length !== rewards.length){
                    rewards.push(0)
                }
            } else {
                rewards = rewards.slice(0, nodes.length)
            }
        }

        return nodes.map((node, i) => {
            node.data.reward = rewards[i]
            return node
        })
    }

    update(newState){
        return new MarkovRewardProcess(
            utils.isDefined(newState.states) ? newState.states : this.states
          , utils.isDefined(newState.P) ? newState.P : this.P
          , utils.isDefined(newState.rewards) ? newState.rewards : this.rewards
          , utils.isDefined(newState.gamma) ? newState.gamma : this.gamma
          , utils.isDefined(newState.horizon) ? newState.horizon : this.horizon
          , utils.isDefined(newState.epsilon) ? newState.epsilon : this.epsilon
        )
    }

    export(){
        return btoa(JSON.stringify({
            states: this.states,
            P: this.P,
            rewards: this.rewards,
            gamma: this.gamma,
            horizon: this.horizon === Infinity ? "Infinity" : this.horizon,
            epsilon: this.epsilon
        }))
    }

    
}