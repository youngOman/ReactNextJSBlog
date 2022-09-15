import {request,gql} from 'graphql-request'

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT; // endpoint .env檔

export const getPosts = async() =>{
    const query = gql`
        query MyQuery {
            postsConnection {
                edges {
                    node{
                        author {
                            bio
                            name
                            id
                            photo {
                            url
                            }
                        }
                        id
                        createdAt
                        slug
                        title
                        excerpt
                        thumbnail {
                            url
                        }
                        categories {
                            name
                            slug
                        }
                    }
                }
            }
        }
        
    `
    const result =  await request(graphqlAPI,query)
    return result.postsConnection.edges;
} 

export const getPostDetails = async(slug) =>{
    const query = gql`
        query GetPostDetails ($slug:String!){
            post(where: {slug:$slug}){
                author {
                    bio
                    name
                    id
                    photo {
                    url
                    }
                }
                createdAt
                slug
                title
                excerpt
                thumbnail {
                    url
                }
                categories {
                    name
                    slug
                }
                content{
                    raw
                }
            }
        }  
    `
    const result =  await request(graphqlAPI,query,{ slug })
    return result.post;
} 
// 首頁的側欄 顯示最新貼無文
export const getRecentPosts = async() =>{
    const query = gql`
        query GetPostDetails {
            posts(
                orderBy: createdAt_ASC, last: 3
                ){
                title
                createdAt
                slug
                thumbnail {
                    url
                }
            }
        }
        
    `
    const result = await request(graphqlAPI,query)
    return result.posts
}
// category !在[]裡的˙=List裡不能有null member List本身可以是null
// slug_not 不要取得目前所在頁面的 slug 要取得目前除這篇以外的相同category的貼文
// 進入特定文章的狀態 顯示類似貼文
export const getSimilarPosts = async (categories,slug) => {
    const query = gql`
        query GetPostDetails($slug:String!,$categories:[String!]){
            posts(
                where:{slug_not:$slug AND: {categories_some :{slug_in:$categories}}}
                last: 3
            ){
                title
                createdAt
                slug
                thumbnail {
                    url
                }
            } 

        }
    `
    const result = await request(graphqlAPI,query,{categories,slug})
    return result.posts
}

export const getCategories = async() =>{
    const query = gql`
        query GetCategories {
            categories {
                name
                slug
            }
        }
        `
    const result = await request(graphqlAPI,query)
    return result.categories        
} 

export const getCategoryPost = async (slug) =>{
    const query = gql`
        query getCategoryPost($slug:String!){
            postsConnection(where: {categories_some: {slug:$slug}}) {
                edges {
                  cursor
                  node {
                    author {
                      bio
                      name
                      id
                      photo {
                        url
                      }
                    }
                    id
                    createdAt
                    slug
                    title
                    excerpt
                    thumbnail {
                      url
                    }
                    categories{
                      name
                      slug
                    }
                  }
                }
            }
        }
    `
    const result =  await request(graphqlAPI,query,{ slug })
    return result.postsConnection.edges;
}


export const getFeaturedPost = async () =>{
    const query = gql`
        query GetFeaturedPost(){
            posts(where: {featuredPost:true}) {
                author{
                    name
                    photo{
                    url
                    }
                }
                thumbnail{
                    url
                }
                title
                slug
                createdAt
            }
        }
    
    `
    const result =  await request(graphqlAPI,query)
    return result.posts
}
