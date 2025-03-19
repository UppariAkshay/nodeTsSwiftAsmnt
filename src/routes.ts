import { Router, Request, Response, response } from "express";
import User from './models/users'
import Post from "./models/posts";
import Comment from "./models/comment";

const router = Router()

interface UserType {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
      street: string;
      suite: string;
      city: string;
      zipcode: string;
      geo: {
        lat: string;
        lng: string;
      };
    };
    phone: string;
    website: string;
    company: {
      name: string;
      catchPhrase: string;
      bs: string;
    };
  }

interface PostType{
        userId: number,
        id: number,
        title: string,
        body: string
  }
  
  interface CommetType{
    postId: Number,
    id: Number,
    name: String,
    email: String,
    body: String
  }

  interface UserRequestBody {
    id: number,
    name: string,
    username: string,
    email: string,
    address: {
        street: string,
        suite: string,
        city: string,
        zipcode: string,
        geo: { lat: string, lng: string }
    },
    phone: string,
    website: string,
    company: { name: string, catchPhrase: string, bs: string },
    posts: { id: number, title: string, body: string }[],
}



  router.get("/load", async (_req: Request, res: Response) => {
    try {
      //---------users---------

      const usersResponse = await fetch("https://jsonplaceholder.typicode.com/users");
      const usersList: UserType[] = await usersResponse.json();
  
      usersList.forEach(async (user: UserType) => {
        await User.findOneAndUpdate({id: Number(user.id)}, user, {upsert: true, new: true})
      });



      //--------- posts------------

      const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts')
      const postsList: PostType[] = await postsResponse.json();

      postsList.forEach(async (post: PostType) => {
        await Post.findOneAndUpdate({id: Number(post.id)}, post, {upsert: true, new: true})
      })



      //-----------comment----------
  
      const commentResponse = await fetch('https://jsonplaceholder.typicode.com/comments')
      const commetList: CommetType[] = await commentResponse.json()

      commetList.forEach(async (comment: CommetType) => {
        await Comment.findOneAndUpdate({id: Number(comment.id)}, comment, {upsert: true, new: true})
      })


      res.status(200).send([])
      
    } catch (error) {
      res.status(500).json({ error: "Error loading users" });
    }
  });

  router.delete('/users', async (_req: Request, res: Response) => {
    try {
        await User.deleteMany()
        res.status(200).send('All users deleted')
    }
    catch (err)
    {
        res.send(err)
    }
    
  })
  
  router.delete('/users/:userId', async (req: Request, res: Response) => {
    try {
        const {userId} = req.params
        const result = await User.deleteOne({id: userId})

        if (result.deletedCount === 0)
        {
            res.status(404).send('User not Found')
        }
        res.status(200).send('User deleted Succuessfully')
    }
    catch(err) {
        res.send(err)
    }
  })

  router.get('/user/:userId', async (req: Request, res: Response) => {
    const {userId} = req.params
    const user = await User.findOne({id: Number(userId)})

    if (!user)
    {
        res.status(404).send('user not found')
    }

    res.status(200).send(user)
  })
  
  //   router.put('/users', async (req: Request, res: Response) => {
  //   try {
  //       const userData = req.body

  //       const response = await User.findOne({id: Number(userData.id)})

  //       if (response)
  //       {
  //           return res.send('user already exists')
  //       }
        
  //       const {posts, ...user} = userData
        
  //       const newUser = new User(user)
  //       console.log(newUser)
  //       await newUser.save()


  //       const postData: PostType[] = posts.map((post: {id:number, body:string, title:string }) => ({userId: Number(userData.id), id: Number(post.id), title: post.title, body: post.body}))
  //       const newPosts = await Post.insertMany(postData)
  //       console.log(newPosts)

  //       return res.send()
  //       console.log(userData.id)
  //   }
  //   catch (err)
  //   {
  //       return res.send(err)
  //   }
  // })

  router.put('/users', async (req: Request, res: Response): Promise <void> => {
    const {posts, ...user} = req.body

    const result = await User.findOne({id: user.id})

    //--------user--------
    if (result)
    {
       res.send('user already exists')
       return
    }

    const newUser = new User(user)
    await newUser.save()
    console.log(newUser)


    //-----------post---------------
    const postIds = posts.map((post: {id: number}) => post.id)
    
    const existingPosts = await Post.find({ id: { $in: postIds } });

    if (existingPosts.length > 0)
    {
      res.status(400).send('user added successfully, post did not added because post already exists')
      return
    }

    const postData: PostType[] = posts.map((post: {id:number, body:string, title:string }) => ({userId: Number(user.id), id: Number(post.id), title: post.title, body: post.body}) )
    const newPosts = await Post.insertMany(postData)
    console.log(newPosts)



    //-----------comment---------
    const commentIds = posts.comments.map((comment: {id: number}) => ({id: comment.id}))

    const existingComments = await Comment.find({id: { $in: commentIds }});

    if (existingComments.length > 0)
    {
      res.status(400).send('user added successfully, post added successfully, comment did not add successfully because comment already exists')
      return
    }

    const commentData: CommetType[] = posts.comments.map((comment: {id: number, name: string, email: string, body: string}) => ({postId: posts.id, ...comment}))
    const newComments = await Comment.insertMany(commentData)
    console.log(newComments)

    
    res.send('user, post, comments added successfully')
})



  export default router;

