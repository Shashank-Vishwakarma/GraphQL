import { useQuery, gql } from '@apollo/client'
import React from 'react'

const App = () => {

  const GET_TODOS = gql`
    query Query{
      todos {
        title
      }
    }
  `;

  const {loading, error, data} = useQuery(GET_TODOS);
  if(loading) {
    return <>Loading</>;
  }

  if(error) {
    return <>Error</>;
  }

  return (
    <div>
      {data.todos.map((element)=>(
        <p key={element.id}>Title : {element.title}</p>
      ))}
    </div>
  )
}

export default App
