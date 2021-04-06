import React, { useEffect } from 'react';
import {
  Container,
  FeaturedLoop,
  PageHeading,
  Subheadline,
  Page,
  Button,
  Error,
  Box,
  LockOverlay,
  CategoryLoop,
} from '../primitives';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { AnalyticsServiceType, Week, TotalStats, TotalsMap } from 'common';
import { useContainer, useQuery, useMutation } from '../hooks';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const AnalyticsScreen: React.FC = () => {
  const classes = useStyles();

  const container = useContainer();
  const service = container.getInstance<AnalyticsServiceType>(
    'analyticsService',
  );

  const { data, error, loading } = useQuery<Week[]>(service.get);
  const {
    data: totals,
    error: totalsError,
    loading: totalsLoading,
    fetch: fetchTotals,
  } = useQuery<TotalsMap>(service.getTotals);

  const { loading: mutateLoading, error: mutateError, mutate } = useMutation(
    service.updateTotals,
  );

  const handleUpdate = () => {
    mutate();
    fetchTotals();
  };

  const columns = [
    'startDate',
    'endDate',
    'signups',
    // 'activeSubs',
    'newSubs',
    'cancellations',
    'plays',
    'completions',
    'favs',
  ];

  return (
    <>
      <PageHeading title="Analytics" />
      <Box row justifyContent="space-between">
        <Subheadline>Total</Subheadline>
        <Button
          text="update (refresh after)"
          size="small"
          variant="text"
          onPress={handleUpdate}
          disabled={mutateLoading}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {totals &&
                Object.keys(totals).map((key: string) => {
                  return <TableCell key={key}>{key}</TableCell>;
                })}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {totals &&
                Object.values(totals).map(stat => (
                  <TableCell>{stat}</TableCell>
                ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Subheadline>Weekly</Subheadline>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((key: string) => {
                return <TableCell>{key}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map(row => (
                <TableRow key={row.id}>
                  {columns.map((key: string) => {
                    // @ts-ignore
                    return !!row[key] ? (
                      <TableCell>
                        {
                          // @ts-ignore
                          typeof row[key] === 'string' ||
                          // @ts-ignore
                          typeof row[key] === 'number'
                            ? // @ts-ignore
                              row[key]
                            : // @ts-ignore
                              row[key].total
                        }
                      </TableCell>
                    ) : (
                      '--'
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AnalyticsScreen;
