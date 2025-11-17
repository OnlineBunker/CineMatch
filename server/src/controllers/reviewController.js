import prisma from "../config/db.js";

const createReview = async (req, res) => {
    try {
        const {tmdbId, rating, comment } = req.body;

        if (!tmdbId || !rating || !comment) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const review = await prisma.review.create({
            data: {
                tmdbId: Number(tmdbId),
                rating: Number(rating),
                comment,
                userId: req.user.id
            }
        });
        res.status(201).json({ message: "Review created successfully", review });

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getMyReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { userId: req.user.id }
        });

        res.status(200).json({ reviews });

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteReview = async ( req, res ) => {
    try {
        const reviewId = Number(req.params.id);

        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        })

        if (!review || review.userId !== req.user.id) {
            return res.status(404).json({ message: "Not allowed" });
        }

        await prisma.review.delete({
            where: { id: reviewId }
        })
        res.status(200).json({ message: "Review deleted" });

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateReview = async ( req, res ) => {
    try {
        const reviewId = Number(req.params.id);
        const { rating, comment } = req.body;

        const review = await prisma.review.findUnique({
            where : { id: reviewId }
        })
        if (!review || review.userId !== req.user.id) {
            return res.status(404).json({ message: "Not allowed" });
        }

        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: {
                rating: Number(rating),
                comment
            }
        });
        res.status(200).json({ message: "Review updated successfully", updatedReview });

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { createReview, getMyReviews, deleteReview, updateReview };