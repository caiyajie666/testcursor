<template>
  <div>
    <!-- Hero Section - 代购服务主横幅 -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold text-white mb-4">
              专业中国代购服务
            </h1>
            <p class="lead text-white mb-4">
              为全球用户提供安全、快捷、专业的中国商品代购服务<br>
              从下单到收货，全程无忧保障
            </p>
            <div class="d-flex flex-wrap gap-3 mb-4">
              <button class="btn btn-light btn-lg px-4" @click="scrollToSection('estimate')">
                <i class="fas fa-calculator me-2"></i>价格估算
              </button>
              <button class="btn btn-outline-light btn-lg px-4" @click="scrollToSection('order')">
                <i class="fas fa-exchange-alt me-2"></i>订单转发
              </button>
            </div>
            <div class="d-flex align-items-center text-white-50">
              <i class="fas fa-shield-alt me-2"></i>
              <small>安全保障 · 全程跟踪 · 专业服务</small>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-image-container">
              <div class="hero-stats-grid">
                <div class="stat-card">
                  <div class="stat-number">10000+</div>
                  <div class="stat-label">成功订单</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">50+</div>
                  <div class="stat-label">合作平台</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">24/7</div>
                  <div class="stat-label">在线客服</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">99%</div>
                  <div class="stat-label">满意度</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 服务流程 -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">代购服务流程</h2>
          <p class="text-muted">简单三步，轻松购买中国商品</p>
        </div>
        <div class="row g-4">
          <div class="col-md-4" v-for="(step, index) in serviceSteps" :key="step.id">
            <div class="process-card text-center">
              <div class="process-number">{{ index + 1 }}</div>
              <div class="process-icon mb-3">
                <i :class="step.icon" class="display-4 text-primary"></i>
              </div>
              <h5 class="fw-bold">{{ step.title }}</h5>
              <p class="text-muted">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 价格估算工具 -->
    <section id="estimate" class="py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h2 class="fw-bold mb-4">智能价格估算</h2>
            <p class="lead text-muted mb-4">
              输入商品链接，即可获得准确的代购价格预估，包含商品价格、服务费和运费。
            </p>
            <ul class="list-unstyled">
              <li class="mb-2"><i class="fas fa-check text-success me-2"></i>支持淘宝、天猫、京东等主流平台</li>
              <li class="mb-2"><i class="fas fa-check text-success me-2"></i>实时汇率计算</li>
              <li class="mb-2"><i class="fas fa-check text-success me-2"></i>透明费用明细</li>
            </ul>
          </div>
          <div class="col-lg-6">
            <div class="card shadow-sm">
              <div class="card-body p-4">
                <form @submit.prevent="handleEstimate">
                  <div class="mb-3">
                    <label class="form-label">商品链接</label>
                    <input 
                      type="url" 
                      class="form-control" 
                      v-model="estimateForm.productUrl"
                      placeholder="请粘贴淘宝、天猫或京东商品链接"
                      required
                    >
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label">数量</label>
                        <input 
                          type="number" 
                          class="form-control" 
                          v-model="estimateForm.quantity"
                          min="1" 
                          value="1"
                        >
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label">配送国家</label>
                        <select class="form-select" v-model="estimateForm.country">
                          <option value="US">美国</option>
                          <option value="CA">加拿大</option>
                          <option value="AU">澳大利亚</option>
                          <option value="UK">英国</option>
                          <option value="DE">德国</option>
                          <option value="JP">日本</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary w-100" :disabled="estimating">
                    <i class="fas fa-calculator me-2"></i>
                    {{ estimating ? '计算中...' : '获取估价' }}
                  </button>
                </form>
                
                <!-- 估价结果 -->
                <div v-if="estimateResult" class="mt-4 p-3 bg-light rounded">
                  <h6 class="fw-bold mb-3">估价结果</h6>
                  <div class="row text-center">
                    <div class="col-4">
                      <div class="small text-muted">商品价格</div>
                      <div class="fw-bold">¥{{ estimateResult.productPrice }}</div>
                    </div>
                    <div class="col-4">
                      <div class="small text-muted">服务费</div>
                      <div class="fw-bold">¥{{ estimateResult.serviceFee }}</div>
                    </div>
                    <div class="col-4">
                      <div class="small text-muted">预估运费</div>
                      <div class="fw-bold">¥{{ estimateResult.shippingFee }}</div>
                    </div>
                  </div>
                  <hr>
                  <div class="text-center">
                    <div class="small text-muted">总计</div>
                    <div class="h5 text-primary fw-bold">¥{{ estimateResult.total }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 订单转发服务 -->
    <section id="order" class="py-5 bg-primary text-white">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 order-lg-2">
            <h2 class="fw-bold mb-4">订单转发服务</h2>
            <p class="lead mb-4">
              已经在中国电商平台下单？我们提供专业的订单转发服务，帮您将商品安全送达。
            </p>
            <div class="row g-3">
              <div class="col-sm-6">
                <div class="d-flex align-items-center">
                  <i class="fas fa-truck fa-2x me-3"></i>
                  <div>
                    <div class="fw-bold">多种物流</div>
                    <small class="opacity-75">EMS、DHL、FedEx等</small>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="d-flex align-items-center">
                  <i class="fas fa-box-open fa-2x me-3"></i>
                  <div>
                    <div class="fw-bold">专业验货</div>
                    <small class="opacity-75">确保商品质量</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 order-lg-1">
            <div class="card bg-white text-dark">
              <div class="card-body p-4">
                <h5 class="card-title">提交转发订单</h5>
                <form @submit.prevent="handleOrderSubmit">
                  <div class="mb-3">
                    <label class="form-label">订单号</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="orderForm.orderNumber"
                      placeholder="请输入中国电商平台订单号"
                      required
                    >
                  </div>
                  <div class="mb-3">
                    <label class="form-label">购买平台</label>
                    <select class="form-select" v-model="orderForm.platform" required>
                      <option value="">请选择平台</option>
                      <option value="taobao">淘宝</option>
                      <option value="tmall">天猫</option>
                      <option value="jd">京东</option>
                      <option value="pdd">拼多多</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">收货地址</label>
                    <textarea 
                      class="form-control" 
                      v-model="orderForm.address"
                      rows="3" 
                      placeholder="请输入详细的收货地址"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary w-100" :disabled="submittingOrder">
                    <i class="fas fa-paper-plane me-2"></i>
                    {{ submittingOrder ? '提交中...' : '提交转发申请' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门代购商品 -->
    <section class="py-5">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 class="fw-bold mb-2">热门代购商品</h2>
            <p class="text-muted mb-0">精选中国热销商品，一键代购</p>
          </div>
          <router-link to="/products" class="btn btn-outline-primary">
            查看全部 <i class="fas fa-arrow-right ms-1"></i>
          </router-link>
        </div>
        
        <div class="row g-4">
          <div class="col-lg-3 col-md-6" v-for="product in featuredProducts" :key="product.id">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </section>

    <!-- 服务优势 -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">为什么选择PinguBuy？</h2>
          <p class="text-muted">专业团队，贴心服务</p>
        </div>
        <div class="row g-4">
          <div class="col-lg-3 col-md-6" v-for="advantage in advantages" :key="advantage.id">
            <div class="advantage-card text-center h-100">
              <div class="advantage-icon mb-3">
                <i :class="advantage.icon" class="display-4 text-primary"></i>
              </div>
              <h5 class="fw-bold">{{ advantage.title }}</h5>
              <p class="text-muted">{{ advantage.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 客户评价 -->
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">客户评价</h2>
          <p class="text-muted">听听客户怎么说</p>
        </div>
        <div class="row g-4">
          <div class="col-md-4" v-for="review in reviews" :key="review.id">
            <div class="review-card">
              <div class="d-flex mb-3">
                <div class="review-avatar me-3">
                  <i class="fas fa-user-circle fa-3x text-muted"></i>
                </div>
                <div>
                  <h6 class="mb-1">{{ review.name }}</h6>
                  <div class="text-warning">
                    <i v-for="star in review.rating" :key="star" class="fas fa-star"></i>
                  </div>
                </div>
              </div>
              <p class="text-muted">"{{ review.comment }}"</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useMainStore } from '../stores'
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'Home',
  components: {
    ProductCard
  },
  setup() {
    const store = useMainStore()
    
    // 表单数据
    const estimateForm = ref({
      productUrl: '',
      quantity: 1,
      country: 'US'
    })
    
    const orderForm = ref({
      orderNumber: '',
      platform: '',
      address: ''
    })
    
    // 状态
    const estimating = ref(false)
    const submittingOrder = ref(false)
    const estimateResult = ref(null)
    
    // 服务流程
    const serviceSteps = [
      {
        id: 1,
        icon: 'fas fa-link',
        title: '提交链接',
        description: '复制中国电商平台商品链接，提交给我们进行价格估算'
      },
      {
        id: 2,
        icon: 'fas fa-credit-card',
        title: '确认付款',
        description: '确认估价后付款，我们立即开始为您代购商品'
      },
      {
        id: 3,
        icon: 'fas fa-shipping-fast',
        title: '国际配送',
        description: '商品到达后验货打包，通过国际快递送到您手中'
      }
    ]
    
    // 服务优势
    const advantages = [
      {
        id: 1,
        icon: 'fas fa-shield-alt',
        title: '安全保障',
        description: '专业团队验货，确保商品质量，提供全程购买保障服务'
      },
      {
        id: 2,
        icon: 'fas fa-shipping-fast',
        title: '快速配送',
        description: '多种物流渠道选择，最快3-7天送达，实时跟踪物流状态'
      },
      {
        id: 3,
        icon: 'fas fa-headset',
        title: '专业客服',
        description: '7×24小时在线客服，专业解答疑问，贴心服务每一位用户'
      },
      {
        id: 4,
        icon: 'fas fa-dollar-sign',
        title: '透明费用',
        description: '无隐藏费用，所有费用明细清晰展示，让您购买更放心'
      }
    ]
    
    // 客户评价
    const reviews = [
      {
        id: 1,
        name: 'Sarah M.',
        rating: 5,
        comment: '服务非常专业，商品质量很好，物流也很快，推荐！'
      },
      {
        id: 2,
        name: 'John D.',
        rating: 5,
        comment: '价格透明，客服响应及时，已经是第三次使用了。'
      },
      {
        id: 3,
        name: 'Lisa K.',
        rating: 5,
        comment: '帮我买到了很多在当地买不到的商品，非常满意。'
      }
    ]
    
    // 计算属性
    const featuredProducts = computed(() => store.products.slice(0, 4))
    
    // 方法
    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    
    const handleEstimate = async () => {
      estimating.value = true
      
      // 模拟API调用
      setTimeout(() => {
        const basePrice = Math.floor(Math.random() * 500) + 100
        const serviceFee = Math.floor(basePrice * 0.1)
        const shippingFee = Math.floor(Math.random() * 100) + 50
        
        estimateResult.value = {
          productPrice: basePrice * estimateForm.value.quantity,
          serviceFee: serviceFee * estimateForm.value.quantity,
          shippingFee: shippingFee,
          total: (basePrice + serviceFee) * estimateForm.value.quantity + shippingFee
        }
        
        estimating.value = false
      }, 2000)
    }
    
    const handleOrderSubmit = async () => {
      submittingOrder.value = true
      
      // 模拟API调用
      setTimeout(() => {
        alert('转发申请已提交，我们会在24小时内联系您！')
        orderForm.value = {
          orderNumber: '',
          platform: '',
          address: ''
        }
        submittingOrder.value = false
      }, 1500)
    }
    
    return {
      estimateForm,
      orderForm,
      estimating,
      submittingOrder,
      estimateResult,
      serviceSteps,
      advantages,
      reviews,
      featuredProducts,
      scrollToSection,
      handleEstimate,
      handleOrderSubmit
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.min-vh-75 {
  min-height: 75vh;
}

.hero-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

.process-card {
  position: relative;
  padding: 2rem 1rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.process-card:hover {
  transform: translateY(-5px);
}

.process-number {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
}

.advantage-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.advantage-card:hover {
  transform: translateY(-5px);
}

.review-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  height: 100%;
}

@media (max-width: 768px) {
  .hero-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .display-4 {
    font-size: 2rem;
  }
}
</style>