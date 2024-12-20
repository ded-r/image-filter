import React, { useState } from "react";
import axios from "axios";

function App() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filteredImages, setFilteredImages] = useState<{ [key: string]: string } | null>(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files ? e.target.files[0] : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            setMessage("Please select an image file.");
            return;
        }

        setIsLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await axios.post("https://flask-production-44fb.up.railway.app/apply-filters", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setFilteredImages(response.data.images);
            setMessage("");
        } catch (error) {
            setMessage("An error occurred while processing the image.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div>
                <p className="text-3xl text-center">
                    <b>Image Filter App</b>
                </p>
                <form onSubmit={handleSubmit} className="mt-20 flex flex-col justify-center items-center align-middle space-y-5 lg:flex-row lg:space-y-0">
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                    <button type="submit" className="border border-white py-2 px-4 hover:bg-white hover:text-black transition ease-in-out duration-300">
                        Apply Filters
                    </button>
                </form>

                {isLoading && (
                    <div className="text-center mt-20">
                        <p>
                            <b>Loading...</b>
                        </p>
                    </div>
                )}

                {message && <p className="text-center text-red-500 mt-5">{message}</p>}

                {filteredImages && !isLoading && (
                    <div className="grid lg:grid-cols-3 mt-20">
                        {Object.entries(filteredImages).map(([filterName, base64Image]) => (
                            <div key={filterName} className="flex flex-col items-center justify-center">
                                <h3>{filterName}</h3>
                                <img width={450} height={400} className="m-10" src={`data:image/png;base64,${base64Image}`} alt={filterName} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
