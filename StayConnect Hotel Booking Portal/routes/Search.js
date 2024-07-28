const express = require('express');
const router = express.Router();
const Listing = require('../models/listing'); // Adjust the path as needed
const { isLoggedin } = require('../middleware');

// Search route
router.get('/search',isLoggedin, async (req, res) => {
    const { query } = req.query;
    console.log('Query:', query);
    if (!query) {
        return res.redirect('/listings');
    }
    
    try {
        const regex = new RegExp(query, 'i');
        const listings = await Listing.find({
            $or: [
                { title: regex },
                { location: regex },
                { country: regex },
                
               
            ]
        });
        console.log('Listings found:', listings);
        res.render('listings/searchResults', { listings, query });
    } catch (error) {
        console.error('Search error:', error);
        res.redirect('/listings');
    }
});


module.exports = router;


