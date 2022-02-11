/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import Indexes from 'config/constants/indexes'
import { getWeb3 } from 'utils/web3'
import fetchIndexes from './fetchIndexes'
import {
    fetchIndexUserAllowances,
    fetchIndexUserBalances,
    fetchIndexUserTokenBalances
} from './fetchIndexUser'
import { IndexState, IndexExtended } from '../types'

const initialState: IndexState = { data: [...Indexes] }

export const indexSlice = createSlice({
  name: 'Indexes',
  initialState,
  reducers: {
    setIndexesPublicData: (state, action) => {
      const liveIndexesData: IndexExtended[] = action.payload
      state.data = state.data.map((galaxy) => {
        const liveIndexData = liveIndexesData.find((f) => f.id === galaxy.id)
        return { ...galaxy, ...liveIndexData }
      })
    },
    setIndexUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
    },
  },
})

// Actions
export const { setIndexesPublicData, setIndexUserData } = indexSlice.actions

// Thunks
export const fetchIndexesPublicData = () => async (dispatch) => {
  const indexes = await fetchIndexes()
  dispatch(setIndexesPublicData(indexes))
}

export const fetchIndexUserData = (account) => async(dispatch) => {
    const userIndexAllowances = await fetchIndexUserAllowances(account)
    const userIndexBalances = await fetchIndexUserBalances(account)
    const userIndexTokenBalances = await fetchIndexUserTokenBalances(account)
    console.log(userIndexAllowances)
    const arrayOfUserDataObjects = userIndexAllowances.map((farmAllowance, index) => {
        return {
          index,
          allowance: userIndexAllowances[index],
          indexBalance: userIndexBalances[index],
          indexTokenBalance: userIndexTokenBalances[index],
        }
      })
    
      dispatch(setIndexUserData({ arrayOfUserDataObjects }))
}


export default indexSlice.reducer
