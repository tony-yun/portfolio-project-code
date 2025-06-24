const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-gray-800 animate-spin"></div>
      </div>
    </div>
  )
}

export default Loading
