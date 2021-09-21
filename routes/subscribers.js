const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscriber')
//note - get is just get, post is post and get
// getting all
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find()
        res.json(subscribers)
    } catch (err) {
        res.status(500).json({ message: err.message })
        //err 500 means error is our fault on our server
    }
})
//getting one
router.get('/:id', getSubscriber, (req, res) => {
    res.json(res.subscriber)

})
//creating one
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })
    try {
        const newSubscriber = await subscriber.save()
        //201 means successfully created new object
        res.status(201).json(newSubscriber)
    } catch (err) {
        //400 is gonna fail if user gives us bad data/user input
        res.status(400).json({ message: err.message })
    }
})
//updating one (using patch inplace of put)
router.patch('/:id', getSubscriber, async (req, res) => {
    if (req.body.name != null) {
        res.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != null) {
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }
    try {
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
//deleting one
router.delete('/:id', getSubscriber, async (req, res) => {
    try {
        await res.subscriber.remove()
        res.json({ message: 'deleted subscriber' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//next function - if called, move on to next section of code
async function getSubscriber(req, res, next) {
    let subscriber
    try {
        subscriber = await Subscriber.findById(req.params.id)
        if (subscriber == null) {
            return res.status(404).json({ message: 'cannot find subscriber' })
            //means couldn't find something
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.subscriber = subscriber
    next()
}

module.exports = router