import React from 'react';
import { VscSend } from "react-icons/vsc";

const ChatInput = ({ answer, setAnswer, handleSubmit, isSubmitting, loading }) => {
  return (
    <form onSubmit={handleSubmit} className="flex space-x-3">
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Your answer..."
        className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#97FEED] focus:border-transparent"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting || loading}
        className={`bg-[#97FEED] text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out 
        ${(isSubmitting || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3ef5d6]'}`}
      >
        <VscSend className='size-6 text-[#071952]'></VscSend>
      </button>
    </form>
  );
};

export default ChatInput;
