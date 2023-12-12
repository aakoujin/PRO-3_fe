import React, { useState } from 'react';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
} from '@mui/material';
import { Category, categories } from "../extra_resources/Categories";
import axios from '../api/axios';
import { TagItem } from './SimilarListingsContainer';

interface CategorySelectorProps {
  onCategoriesSelected: (selectedCategories: string[]) => void;
}

export function CategorySelector({ onCategoriesSelected }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [subtags, setSubtags] = useState<TagItem[] | null>([]);
  const [finaltags, setFinalTags] = useState<TagItem[] | null>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
    setSubtags([]);
    setFinalTags([]);
    //setSelectedCategory([]);
  };

  const handleClose = () => {
    setOpen(false);
    setSubtags([]);
    setFinalTags([]);
    setSelectedCategory([]);
  };

  const handleLastSelect = (categoryName: string) => {
    setOpen(false);
    setSubtags([]);
    setFinalTags([]);
    setSelectedCategory((prevSelectedCategories) => [
      ...prevSelectedCategories,
      categoryName,
    ]);
  }

  const handleCategoryClick = async (categoryName: string) => {
    axios
      .get(`Tag/getSubTags/${categoryName}`)
      .then(async (response) => {
        setSelectedCategory([]);
        setSubtags(await response.data);
        setSelectedCategory((prevSelectedCategories) => [
          ...prevSelectedCategories,
          categoryName,
        ]);
      })
      .catch((error) => {
        console.error('Error fetching subtags:', error);
      });
  };

  const handleSubCategoryClick = async (categoryName: string) => {
    axios
      .get(`Tag/getSubTags/${categoryName}`)
      .then(async (response) => {
        setFinalTags(await response.data);
        setSelectedCategory((prevSelectedCategories) => [
          ...prevSelectedCategories,
          categoryName,
        ]);
      })
      .catch((error) => {
        console.error('Error fetching subtags:', error);
      });
  };

  const handleSelect = () => {
    onCategoriesSelected(selectedCategory);
    setOpen(false);
    setSubtags([]);
    setFinalTags([]);
  };

  React.useEffect(() => {
    onCategoriesSelected(selectedCategory);
  }, [selectedCategory//, onCategoriesSelected
  ]);
  //fixes autoreset of tags

  if (subtags.length == 0) {
    return (
      <>
        <Button variant="contained" onClick={handleClickOpen}>
          Select category
        </Button>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>Select a Category</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {categories.map((category) => (
                <Grid item xs={6} key={category.id}>
                  <Card
                    onClick={() => handleCategoryClick(category.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CardContent>
                      <Typography>{category.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSelect} color="primary" variant="contained">
              Select
            </Button>
            <Button onClick={handleClose} color="secondary" variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  } else return (
    <>

      <Button variant="contained" onClick={handleClickOpen}>
        Select category
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Select a Category</DialogTitle>
        <DialogContent>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={4}>
              <List>
                {categories.map((category) => (

                  <ListItem key={category.id}
                    onClick={() => handleCategoryClick(category.name)}
                    style={{ cursor: 'pointer' }}>
                    {category.name}
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={4}>
              <List>
                {Object.values(subtags).map(ti => (
                  <ListItem key={ti.id_tag}
                    onClick={() => handleSubCategoryClick(ti.tag_name)}
                    style={{ cursor: 'pointer' }}>
                    {ti.tag_name}
                  </ListItem>))}
              </List>
            </Grid>
            <Grid item xs={4}>
              <List>
                {Object.values(finaltags).map(ti => (
                  <ListItem
                    onClick={() => handleLastSelect(ti.tag_name)}
                    style={{ cursor: 'pointer' }}
                    key={ti.id_tag}>
                    {ti.tag_name}
                  </ListItem>))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSelect} color="primary" variant="contained">
            Select
          </Button>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}