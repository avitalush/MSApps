import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import axios from 'axios';
import './CssFile.css';

function ImagesFile() {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [contentList, setContentList] = useState([]);
  const [hasMoreImages, setHasMoreImages] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const closeTypeModal = () => {
    setModalOpen(false);
  };

  const openTypeModal = () => {
    setModalOpen(true);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    closeTypeModal();
    setCurrentPage(1);
  };

  const modalContent = (
    <div>
      <DialogTitle>Select Photo Type</DialogTitle>
      <DialogContent>
        {contentList.map((content) => (
          <Button key={content} onClick={() => handleTypeSelect(content)}>
            {content}
          </Button>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeTypeModal}>Cancel</Button>
      </DialogActions>
    </div>
  );
  const openImageModal = (image) => {
    fetchImageDetails(image.id)
      .then((details) => {
        setSelectedImage({ ...image, details });
        setImageModalOpen(true);
        
      })
      .catch((error) => {
        console.error('Error fetching image details:', error);
        setSelectedImage(image);
        setImageModalOpen(true);
      });
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
  };

const imageModalContent = (
  
  <div>
    {selectedImage && (
      <>
      
        <DialogTitle>Image Parameters</DialogTitle>
        <DialogContent>

          {selectedImage.details ? (
            Object.entries(selectedImage.details).map(([key, value]) => (
              <div key={key}>
                {key}: {value}
              </div>
            ))
          ) : (
            <div>No details available for this image.</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeImageModal}>Close</Button>
        </DialogActions>
      </>
    )}
  </div>
);

  const fetchImageDetails = (imageId) => {
    return axios
      .get(`http://localhost:3001/images/${imageId}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error fetching image details:', error);
        throw error;
      });
  };

  useEffect(() => {
    fetchCategories();
    fetchImages(selectedType);
  }, [currentPage, selectedType]);

  const fetchImages = (category) => {
    fetch(`http://localhost:3001/images?page=${currentPage}&category=${category}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setHasMoreImages(false);
        } else {
          setImages(data);
          setHasMoreImages(true);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const fetchCategories = () => {
    axios
      .get('https://pixabay.com/api/', {
        params: {
          key: '25540812-faf2b76d586c1787d2dd02736',
        },
      })
      .then((response) => {
        const tags = response.data.hits.map((image) => image.tags);
        const allTags = tags.join(',');
        const uniqueTags = Array.from(new Set(allTags.split(','))).map((tag) => tag.trim());

        setContentList(uniqueTags);
      })
      .catch((error) => console.error('Error:', error));
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    if (hasMoreImages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="App">
      <h1> Images</h1>
      <div className="button-container">
        <Button variant="outlined" onClick={goToPrevPage}>
          👈prev
        </Button>
        <Button variant="outlined" onClick={openTypeModal} className="select-type-button">
          Select👇Type
        </Button>
        <Button variant="outlined" onClick={goToNextPage} disabled={!hasMoreImages}>
          next👉
        </Button>
      </div>
      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid item xs={4} key={image.id}>
            <img
              src={image.webformatURL}
              alt={image.tags}
              style={{ width: '100%' }}
              onClick={() => openImageModal(image)}
            />
           
          </Grid>
        ))}
      </Grid>
      <Dialog open={isModalOpen} onClose={closeTypeModal}>
        {modalContent}
      </Dialog>
      <Dialog open={isImageModalOpen} onClose={closeImageModal}>
        {imageModalContent}
      </Dialog>
    </div>
  );
}

export default ImagesFile;
