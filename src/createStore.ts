import {useEffect, useRef, useState} from 'react'

export type State = Record<string,any>
export type SetState =(action:((v:State)=>State)|State,isReplace?:boolean)=>void
export type GetState =()=>State;
export type Selector = (v:State)=>any
export type Subscribe = (callback:(v:State)=>void)=>void
export type Destroy = ()=>void

export type StoreApi ={
  setState: SetState
  getState: GetState
  subscribe: Subscribe
  destroy: Destroy
}

export type CreateState =(set:SetState,get:GetState,api:StoreApi)=>Record<string,any>

export const create = (createState:CreateState)=>{
  let state = {}
  const listener: Set<Subscribe> = new Set()
  const get:GetState = ()=>state
  const set:SetState = (action,isReplace)=>{
    const nextState = typeof action === 'function'? action(state):action
    if(isReplace){
      state = nextState
    }else{
      state = {
        ...state,
        ...nextState
      }
    }
    if(nextState !== state){
      listener.forEach(v=>v(nextState))
    }
  }
  const subscribe:Subscribe = (callback)=>{
    listener.add(callback)
    return ()=>listener.delete(callback)
  }

  const destroy = ()=>{
    listener.clear()
  }

  state = createState(set,get,{getState:get,setState:set,subscribe,destroy})

  const useStore = (selector:Selector)=>{
    const [,forceUpdate] = useState(0)
    const preSliceRef = useRef<any>()
    const selectorRef = useRef(selector)
    useEffect(()=>{
      const unsubscribe = subscribe((_state=>{
        const currentSlice = selectorRef.current(state)
        if(preSliceRef.current !== currentSlice){
          if(preSliceRef.current){
            forceUpdate(v=>v+1)
          }
          preSliceRef.current = currentSlice
        }
      }))
      return unsubscribe
    },[])
  }
  return useStore
}


// export const createUseStore = (listener:any[])=>{

// }

// todo ts 类型

const a = create((set,get,_api)=>{
  return {
    test:1,
    add:()=>{
      set({
        test:get().test+10
      })
    }
  }
})
