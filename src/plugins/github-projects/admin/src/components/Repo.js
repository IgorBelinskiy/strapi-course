import React, { useState, useEffect } from 'react';
import {
  Table, Thead, Tbody, Tr, Td, Th
} from '@strapi/design-system';
import {
  Box, Typography, BaseCheckbox, Loader, Alert, Link, Flex, IconButton
} from '@strapi/design-system';
import axiosInstance from '../utils/axiosInstance';
import { Pencil, Trash, Plus } from '@strapi/icons';

const COL_COUNT = 5;
const Repo = () => {
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRepos, setSelectedRepos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      axiosInstance.get('github-projects/repos')
        .then((response) => {
          console.log(response.data);
          setRepos(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setError(error);
          setIsLoading(false);
        })
    };
    fetchData();
  }, []);

  const createProject = async (repo) => {
    const resp = await axiosInstance.post('github-projects/project', repo)
    console.log('resp', resp);
  };

  const allSelected = selectedRepos.length === repos.length;
  const isIndeterminate = !!selectedRepos.length && !allSelected;

  if (isLoading) return <Loader>d</Loader>;
  if (error) return (
    <Alert closeLabel="Close alert" title="Title" variant="danger">
      {error.toString()}
    </Alert>
  )

  return (
    <Box padding={8} background="neutral100">
      <Table colCount={COL_COUNT} rowCount={repos.length}>
        <Thead>
          <Tr>
            <Th>
              <BaseCheckbox
                aria-label="Select all entries"
                value={allSelected}
                indeterminate={isIndeterminate}
                onValueChange={(value) => value
                  ? setSelectedRepos(repos.map((repo) => repo.id))
                  : setSelectedRepos([])}
              />
            </Th>
            <Th>
              <Typography variant="sigma">Home</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Description</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Url</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Actions</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {repos.map((repo) => {
            const { id, name, shortDescription, url, projectId } = repo;
            return (
              <Tr key={id}>
                <Td>
                  <BaseCheckbox
                    aria-label={`Select ${id}`}
                    value={selectedRepos.includes(id)}
                    onValueChange={(value) => value
                      ? setSelectedRepos([...selectedRepos, id])
                      : setSelectedRepos(selectedRepos.filter((repoId) => repoId !== id))}
                  />
                </Td>
                <Td>
                  <Typography textColor="neutral800">{name}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{shortDescription}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    <Link href={url} isExternal>{url}</Link>
                  </Typography>
                </Td>
                <Td>
                  {projectId
                    ? (
                      <Flex>
                        <Link to={`/content-manager/collectionType/plugin::github-projects.project/${projectId}`}>
                          <IconButton
                            onClick={() => console.log('edit')}
                            label="Edit" noBorder
                            icon={<Pencil/>}
                          />
                        </Link>
                        <Box paddingLeft={1}>
                          <IconButton
                            onClick={() => console.log('delete')}
                            label="Delete"
                            noBorder icon={<Trash />}
                          />
                        </Box>
                      </Flex>
                    )
                    : (
                      <IconButton
                        onClick={() => createProject(repo)}
                        label="Add"
                        noBorder icon={<Plus />}
                      />
                    )}
                </Td>
              </Tr>)
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Repo;
