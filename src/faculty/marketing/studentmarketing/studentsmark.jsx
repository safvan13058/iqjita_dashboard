import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../staffmarketing/staffmark.css';
import { FiUpload } from "react-icons/fi";

const API_URL = 'https://software.iqjita.com/bannerimage.php';

const StuMarketingBannerPage = () => {
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ Load student banners from API
    useEffect(() => {
        fetch(`${API_URL}?type=student`)
            .then(res => res.json())
            .then(data => setBanners(data))
            .catch(err => console.error('Error fetching banners:', err));
    }, []);

    // ✅ Handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // ✅ Upload banner to server
    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('type', 'student');

        try {
            setLoading(true);
            const res = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (res.ok) {
                setBanners(prev => [{ id: Date.now(), image_url: data.image_url }, ...prev]);
                setSelectedFile(null);
            } else {
                alert(data.error || "Upload failed");
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert("Something went wrong during upload.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Delete banner from server
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;

        try {
            const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok) {
                setBanners(prev => prev.filter(b => b.id !== id));
            } else {
                alert(data.error || "Delete failed");
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert("Something went wrong during delete.");
        }
    };

    return (
        <div className="banner-page-container">
            <div className='banner-top'>
                <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
                <h2>Student-Marketing Banners</h2>
            </div>

            <div className="upload-section">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={!selectedFile || loading}>
                    <FiUpload style={{ marginRight: "6px", verticalAlign: "middle" }} />
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </div>

            <div className="banner-grid">
                {banners.length === 0 && <p>No banners uploaded yet.</p>}
                {banners.map(banner => (
                    <div key={banner.id} className="banner-card">
                        <img src={banner.image_url} alt="Banner" />
                        <button className="delete-button" onClick={() => handleDelete(banner.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StuMarketingBannerPage;
