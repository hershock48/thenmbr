// Dashboard Screen for NMBR Mobile App

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

import { apiService } from '../../services/ApiService';
import { User, Organization, RevenueMetrics } from '../../types';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  navigation: any;
  route: any;
  user?: User;
  organization?: Organization;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
  navigation, 
  user, 
  organization 
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(null);
  const [recentStories, setRecentStories] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (organization?.id) {
        const [revenueResponse, storiesResponse, productsResponse] = await Promise.all([
          apiService.getRevenueMetrics(organization.id),
          apiService.getStories(organization.id),
          apiService.getProducts(),
        ]);

        if (revenueResponse.success) {
          setRevenueMetrics(revenueResponse.data);
        }

        if (storiesResponse.success) {
          setRecentStories(storiesResponse.data.slice(0, 3));
        }

        if (productsResponse.success) {
          setTopProducts(productsResponse.data.slice(0, 5));
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const chartConfig = {
    backgroundColor: Colors.primary,
    backgroundGradientFrom: Colors.primary,
    backgroundGradientTo: Colors.primaryLight,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.accent,
    },
  };

  const renderMetricCard = (title: string, value: string, icon: string, color: string) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricContent}>
        <View style={styles.metricText}>
          <Text style={styles.metricTitle}>{title}</Text>
          <Text style={styles.metricValue}>{value}</Text>
        </View>
        <Icon name={icon} size={24} color={color} />
      </View>
    </View>
  );

  const renderStoryCard = (story: any) => (
    <TouchableOpacity 
      key={story.id} 
      style={styles.storyCard}
      onPress={() => navigation.navigate('StoryDetail', { storyId: story.id })}
    >
      <View style={styles.storyContent}>
        <Text style={styles.storyTitle} numberOfLines={2}>
          {story.title}
        </Text>
        <Text style={styles.storyMeta}>
          {story.views} views • {story.likes} likes
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderProductCard = (product: any) => (
    <TouchableOpacity 
      key={product.id} 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
    >
      <View style={styles.productContent}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>
          {formatCurrency(product.price)}
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="refresh" size={32} color={Colors.primary} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.organizationName}>
              {organization?.name || 'Your Organization'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="notifications" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Metrics */}
        <View style={styles.metricsContainer}>
          {revenueMetrics && (
            <>
              {renderMetricCard(
                'Total Revenue',
                formatCurrency(revenueMetrics.totalRevenue),
                'trending-up',
                Colors.success
              )}
              {renderMetricCard(
                'Total Orders',
                revenueMetrics.totalOrders.toString(),
                'shopping-cart',
                Colors.primary
              )}
              {renderMetricCard(
                'Avg Order Value',
                formatCurrency(revenueMetrics.averageOrderValue),
                'attach-money',
                Colors.accent
              )}
              {renderMetricCard(
                'Profit Margin',
                `${revenueMetrics.profitMargin.toFixed(1)}%`,
                'percent',
                Colors.purple[500]
              )}
            </>
          )}
        </View>

        {/* Revenue Chart */}
        {revenueMetrics && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Revenue Trend</Text>
            <LineChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    data: [
                      revenueMetrics.totalRevenue * 0.6,
                      revenueMetrics.totalRevenue * 0.7,
                      revenueMetrics.totalRevenue * 0.8,
                      revenueMetrics.totalRevenue * 0.9,
                      revenueMetrics.totalRevenue * 0.95,
                      revenueMetrics.totalRevenue,
                    ],
                  },
                ],
              }}
              width={width - 32}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        {/* Recent Stories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Stories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Stories')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentStories.map(renderStoryCard)}
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Marketplace')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {topProducts.map(renderProductCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  organizationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricText: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  chartContainer: {
    margin: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    borderRadius: 12,
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  storyContent: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  storyMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productContent: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default DashboardScreen;
