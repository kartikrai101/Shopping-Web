class ApiFeatures {
    constructor(query, queryStr){
        this.query = query;  // query can be something like: Product.find()
        this.queryStr = queryStr;  // making these two variables as global variables of this class so that we can use them everywhere in this class        
    }


    // adding the search method to our class
    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {};

        console.log(keyword);

        this.query = this.query.find({...keyword});
        return this; // returning this class itself
    };

    // adding the filter method to our class
    filter(){
        const queryCopy = { ...this.queryStr };
        // Removing some fields from the query string
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach((key) => delete queryCopy[key]);

        // Filter for Price and Rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;  // returning this entire class
    };

    //adding the pagination method to our class
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1; // getting the value of current page number 
        const skip = resultPerPage * (currentPage-1); // counting the products that we have to skip for viewing the products on this page that is requeseted in the query

        this.query = this.query.limit(resultPerPage).skip(skip); // we are basically limiting the numeber of documents that we get from the query and then skipping the number of pages to be skipped before selecting those pictures

        return this;
    }
};

module.exports = ApiFeatures;