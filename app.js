function print(){
    console.log("express")
}
print()

const express = require("express")
const mongoose = require("mongoose")
const app = express();


const port = 3001;

const mongourl= "mongodb://localhost:27017/Expensetracker"
mongoose.connect(mongourl)
.then(()=>{
    console.log("Database Connected successfully")
    app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`)
    })
})
.catch((err)=>console.log(err))

const expenseSchema = new mongoose.Schema({
    id: {type:String, required:true,unique:true},
    title:{type:String, required:true},
    amount:{type:Number, required:true}
});

const expenseModel=mongoose.model("expense-tracker",expenseSchema)
app.get("/api/expenses",async(req,res)=>{
    try{
        const expenses = await expenseModel.find();
        res.status(200).json(expenses);
    } catch(error){
        res.status(500).json({message: "Failed to fetch expenses"});
    }

});
app.get("/api/expenses/:id", async (req, res)=>{
    try{
        const {id}= req.params;
        const expenses = await expenseModel.findOne({ id });
        if(!expense){
            return res.status(404).json({message: "Expense not found"})
        }
        res.status(200).json(expense);
    }catch(error){
        res.status(500).json({message: "Error in the fetching expenses"})
    }
        
    
});
app.use(express.json());

const { v4: uuidv4 } = require("uuid");

app.post("/api/expenses", async (req, res) => {
    try {
        const data = req.body; 

        const newExpense = new expenseModel({
            id: uuidv4(),
            title: data.title,
            amount: data.amount,
        });

        const savedExpense = await newExpense.save();
        res.status(200).json(savedExpense);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Error saving expense", error: error.message });
    }
});

app.put("/api/expenses/:id",async(req,res)=>{
    const{id}=req.params;
    const {title,amount}=req.body;
    console.log({title})
    try{
        const updateExpense=await expenseModel.findOneAndUpdate(
            {id},
            {title,amount}
        );
        if(!updateExpense)
        {
            return res.status(404).json({message:"Expense not found"});
        }
        res.status(200).json({title,amount})
    }
    catch(error){
        res.sendStatus(500).json({message:"Error in updating the message"});
    }
});

app.delete("/api/expenses/:id", async (req, res) => {
    const { id } = req.params; 
    try {
        const deleteExpense = await expenseModel.findOneAndDelete({ id });
        if (!deleteExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error in deleting the expense" });
    }
});











/*
const data =[
    {id:1,name:"Ashmika",age:"20"},
    {id:2,name:"Prathiksha",age:"18"},
    {id:3,name:"Sandya",age:"19"},
];

app.get('/student/details',(req,res)=>{  
    res.json(data);

});
app.listen(port, ()=>{
     console.log(`Server is  running on http://localhost:${port}`);
});

app.get('/api/singledata',(req,res)=>{
    const{name}=req.query;
    if(name)
    {
        const result=data.find((item)=>item.name===String(name));
        if(result)
        {
            res.json(result)
        }
        else{
            res.status(400).json({error:"data not found for the given Name"})
        }
    }
    else{
        res.json(data);
    }
})
app.get('/api/singledata',(req,res)=>{
    const{id}=req.query;
    if(id)
    {
        const result=data.find((item)=>item.id===Number(id));
        if(result)
        {
            res.json(result)
        }
        else{
            res.status(400).json({error:"data not found for the given Name"})
        }
    }
    else{
        res.json(data);
    }
})




app.get('/api/singledata', (req, res) => {   
  const {id,name} = req.query;                  
  if(name){
    const result = data.find(item => item.id===Number(id)&&item.name === name);
    if(result){
        res.json(result);
    } else {
        res.status(400).json({error:'data not found'});
    }
  } else {
    res.json(data);
  }
});
*/
