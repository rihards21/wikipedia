
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = ({

    title: String,
    content: String

});

const Article = mongoose.model('Article', articleSchema);
// there is no semicolumns after our get and post because we want to be able to execute next method we only use it on last one
//app.get("/articles",):
//app.post("/articles",);
//app.delete("/articles", );
// these were deleted because we created route where we store the specific pages mothods so it's easier to axccess


app.route("/articles")
.get(function(req, res){

    // find is empty because we want all values and foundArticles is just callback function where we save our data from .find
    Article.find({}, function(err, foundArticles){
        if (!err){
            //res.send send the data we wanted to client side
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    
    });
    })
    
    .post(function(req, res){
  

        const newArticle = new Article ({
    
        //title and content is from our mongoose model object
        //req.body.content/title are from where we entered them in this case from postman because we didnt have inputs in html
            title: req.body.title,
            content: req.body.content
            
            });
            newArticle.save(function(err){
    if (!err){
    res.send("you added new article");
    }else{
        res.send(err);
    } 
    
            });
    })
    
    
    .delete(function(req, res){
        Article.deleteMany(function(err){
        if(!err){
          res.send("We delete every single article")
        }
        });
        });


/////////////////////////////////Requests targeting a specific article

app.route("/articles/:articleTitle")
.get(function(req, res){
   //we are locking trough the collection articles we gonna find one document with the title that user inserted and than we gonna request
   // the pathway that user typed after /articles/
   //foundArticle is callback function which took value of findOnes
   //title: req.params.articleTitle the article title is what user typed in https request
Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
if (foundArticle){
    res.send(foundArticle)
}else{
res.send("No articles were found sorry")
}
});
})

.put(function(req, res){
Article.updateOne(
    //condition which one do we want to update
    {title: req.params.articleTitle},
    //in which article what do we want to place
    // title and content are from mongoose schema that we created req.body just take info from client
    {title: req.body.title, content: req.body.content},
    //just need this line
    {overwrite: true},
    function(err){
        if(!err){
            res.send("Successfully updated article");
        }
    }

)
})

.patch(function(req, res){


    Article.updateOne(
        {title: req.params.articleTitle},
        //$ set allows us to take just one parameter and req.body take parameters from req.params.articleTitle page

        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            }else{
      res.send(err);

            }
        }
    );
});

app.listen(3000, function(){
console.log("Server started on port 3000");
});
