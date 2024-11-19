import React, { useState } from "react";
import axios from "axios";

function App() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filteredImages, setFilteredImages] = useState<{ [key: string]: string } | null>(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files ? e.target.files[0] : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            setMessage("Please select an image file.");
            return;
        }

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
        }
    };

    return (
        <>
            <div>
                <p className="text-3xl text-center">
                    <b>Image Filter App</b>
                </p>
                <form onSubmit={handleSubmit} className="mt-20 text-center">
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                    <button type="submit" className="border border-white py-2 px-4 hover:bg-white hover:text-black transition ease-in-out duration-300">
                        Apply Filters
                    </button>
                </form>
                {message && <p>{message}</p>}
                {filteredImages && (
                    <div className="grid grid-cols-3 mt-20">
                        {Object.entries(filteredImages).map(([filterName, base64Image]) => (
                            <div key={filterName}>
                                <h3>{filterName}</h3>
                                <img src={`data:image/png;base64,${base64Image}`} alt={filterName} style={{ width: "200px", height: "auto", margin: "10px" }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
