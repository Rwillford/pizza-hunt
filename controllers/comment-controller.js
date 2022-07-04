const { Comment, Pizza } = require('../models');

const commentController = {
    //add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $push: { Comments: _id } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza was found wit htis id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    //remove comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'No comment witrh this ID!'})
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId } },
                {new: ture }
            );
        })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this ID!'})
                return;
            }
            res.sjson(dbPizzaData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = commentController;