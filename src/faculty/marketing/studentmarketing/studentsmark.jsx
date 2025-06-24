import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../staffmarketing/staffmark.css'; // optional CSS
import { FiUpload } from "react-icons/fi";

const StuMarketingBannerPage = () => {
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Add banner to list (simulate upload)
    const handleUpload = () => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setBanners(prev => [...prev, { id: Date.now(), url }]);
            setSelectedFile(null);
        }
    };

    // Delete a banner
    const handleDelete = (id) => {
        setBanners(banners.filter(b => b.id !== id));
    };

    return (
        <div className="banner-page-container">
            <div className='banner-top'>
                <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
                <h2>Stu-Marketing Banners</h2>
            </div>

            <div className="upload-section">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={!selectedFile}>
                    <FiUpload style={{ marginRight: "6px", verticalAlign: "middle" }} />

                </button>

            </div>

            <div className="banner-grid">
                {banners.length === 0 && <p>No banners uploaded yet.</p>}
                {banners.map(banner => (
                    <div key={banner.id} className="banner-card">
                        <img src={banner.url} alt="Banner" />
                        <button className="delete-button" onClick={() => handleDelete(banner.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StuMarketingBannerPage;
