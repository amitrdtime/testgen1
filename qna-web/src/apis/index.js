import axios from "axios";
import axiosInstance from "./axiosInstance";

export const addDocument = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_ADD_DOCUMENT_URL}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDocumentDetails = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_GET_DOCUMENTS}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDocumentFile = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_DELETE_DOCUMENTS}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadDocumentFile = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_DOWNLOAD_DOCUMENTS}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addDataSets = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_ADD_DATASET}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDataSet = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.REACT_APP_LISTDATASET}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDataSet = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_DELETE_DATASET}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const allDocumentUsers = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_GET_NOT_EXISTED_DATASET_USERS}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const allDatasetUsers = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_GET_DATASET_USERS}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addDatasetUsers = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_ADD_DATASET_USERS}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDocUser = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_REMOVE_DATASET_USERS}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatHistoryData = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_GET_CHAT_HISTORY}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getRadioDataSets = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_GET_RADIO_DATASET}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteChatHistory = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_DELETE_CHAT_HISTORY}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editChatHistory = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_EDIT_CHAT_HISTORY}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getChatHistoryConversationData = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_HISTORY_CHAT_CONVERSATION}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatHistoryByFiltering = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_CHAT_HISTORY_FILTER_SORTING}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQnaChatbotData = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_QUESTION_AND_ANSWER}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addChatHistoryData = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_ADD_CHAT}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addSuccessPDFsData = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_ADD_SUCCESS_PDFS}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

