# Markov process simulator (MPS)

Simulate Markov processes directly into your browser.

![A Markov process example]()

Just go to the [github page](public/mp.png) to play with it.

## Intro

This repo has been inspired by the course of David Silver on Reinforcement learning. As he goes through the basics of this algorithm, he uses Markov processes a lot and I've been struggling to find a nice library to visualize and plays with them online.

So ... I built one!

### Goal

Creating a nice simulation environment for Markov process (MP), Markov reward process (MRP) and Markov decision process (MDP) including value-function solver, allowing people to have a "feel" about those algorithms in a convenient fashion.

### Contributing

- Fork the repo
- Make your change
- Write a test
- Make a pull request
  Feedbacks will be fast

## The app

The app has two parts:

- An MP configuration part on the left
- A visualization tool on the right

### The configuration part

#### The Markov process misc panel

Control which kind of MP you want to simulate.

#### The Markov process properties panel

Control all the possible properties of the current selected MP:

- The number of states
- The transition matrix
- The reward values
- The discounted factor gamma
- A possible finite horizon
- The limit epsilon: the difference between the real solution and our approximation

> **Note on the horizon:**

> Whatever you choose for your properties, this will end up as a finite horizon following those rules:
>
> - We calculate a gamma-horizon: `t1` for which `gamma^t1 < epsilon`
> - We get `t2` the horizon given by the user
> - We set the final horizon `T` to `T = Math.min(t1, t2)`

> If `t1` and `t2` are equal to `Infinity`, we just set `T` to `10000`

#### The value functions panel

Control how you approximate the different value-functions

- In one synchronized shot
- Step by step
- Agent based

#### The agent panel

Control the agent, choose:

- where he starts
- how fast he moves
  You can also find different properties about the agent in this panel.

### The vis part

We are using SVG to produce the different MP visualizations. Thanks to React for handling SVG nodes and the D3.js force module to help position them in an adequate fashion.

## Timeline

- ~~Build a Markov process simulator~~
- ~~Build a Markov reward process simulator~~
- ~~Implements saving/loading/viewer feature~~
- ~~Implement an agent~~
- ~~Implements a state-value function solver + an agent based one~~
- ~~Port the code to typescript and add eslint~~
- Implements a Markov decision process simulator
- Implements a policy iteration algorithm and an action-value function solver

## Licence

**MIT**

Check the LICENCE file
