import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface Order {
  id: number;
  product: string;
  customer: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  progress: number;
  date: string;
}

interface Employee {
  id: number;
  name: string;
  role: string;
  online: boolean;
  avatar: string;
  lastMessage?: string;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  type: 'text' | 'voice' | 'image';
  isAdmin?: boolean;
}

interface SupportTicket {
  id: number;
  client: string;
  issue: string;
  status: 'active' | 'waiting' | 'resolved';
  time: string;
  messages: Message[];
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("catalog");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [notifications, setNotifications] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [supportReply, setSupportReply] = useState("");
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    category: "",
    image: "📦"
  });

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Смартфон Premium X", price: 79990, category: "Электроника", image: "📱" },
    { id: 2, name: "Ноутбук Pro 15", price: 129990, category: "Электроника", image: "💻" },
    { id: 3, name: "Наушники Wireless", price: 12990, category: "Аксессуары", image: "🎧" },
    { id: 4, name: "Умные часы Fit", price: 24990, category: "Аксессуары", image: "⌚" },
    { id: 5, name: "Планшет Tab 12", price: 54990, category: "Электроника", image: "📲" },
    { id: 6, name: "Камера 4K Pro", price: 89990, category: "Фото", image: "📷" },
  ]);

  const orders: Order[] = [
    { id: 101, product: "Смартфон Premium X", customer: "Иван Петров", status: "shipped", progress: 75, date: "8 янв" },
    { id: 102, product: "Наушники Wireless", customer: "Мария Сидорова", status: "processing", progress: 40, date: "8 янв" },
    { id: 103, product: "Ноутбук Pro 15", customer: "Алексей Иванов", status: "pending", progress: 10, date: "7 янв" },
    { id: 104, product: "Умные часы Fit", customer: "Ольга Смирнова", status: "delivered", progress: 100, date: "6 янв" },
  ];

  const employees: Employee[] = [
    { id: 1, name: "Анна Волкова", role: "Менеджер продаж", online: true, avatar: "АВ", lastMessage: "Клиент готов к оплате" },
    { id: 2, name: "Дмитрий Козлов", role: "Курьер", online: true, avatar: "ДК", lastMessage: "Заказ #101 доставлен" },
    { id: 3, name: "Елена Морозова", role: "Поддержка", online: false, avatar: "ЕМ", lastMessage: "Решила проблему с возвратом" },
    { id: 4, name: "Сергей Новиков", role: "Склад", online: true, avatar: "СН" },
  ];

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "Анна Волкова", text: "Добрый день! Поступил новый заказ", time: "14:23", type: "text" },
    { id: 2, sender: "Администратор", text: "Отлично, проверьте наличие товара", time: "14:25", type: "text", isAdmin: true },
    { id: 3, sender: "Анна Волкова", text: "🎤 Голосовое сообщение (0:15)", time: "14:26", type: "voice" },
  ]);

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    { 
      id: 1, 
      client: "Иван Петров", 
      issue: "Вопрос по доставке заказа #101", 
      status: "active", 
      time: "Сейчас онлайн",
      messages: [
        { id: 1, sender: "Иван Петров", text: "Здравствуйте! Когда приедет мой заказ?", time: "14:30", type: "text" }
      ]
    },
    { 
      id: 2, 
      client: "Мария Сидорова", 
      issue: "Запрос возврата товара", 
      status: "waiting", 
      time: "5 мин назад",
      messages: [
        { id: 1, sender: "Мария Сидорова", text: "Хочу вернуть товар, он не подошел", time: "14:20", type: "text" }
      ]
    },
    { 
      id: 3, 
      client: "Алексей Иванов", 
      issue: "Технический вопрос по оплате", 
      status: "resolved", 
      time: "1 час назад",
      messages: [
        { id: 1, sender: "Алексей Иванов", text: "Не проходит оплата картой", time: "13:30", type: "text" },
        { id: 2, sender: "Администратор", text: "Попробуйте другую карту или обратитесь в банк", time: "13:35", type: "text", isAdmin: true }
      ]
    },
  ]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: "Clock",
      processing: "Package",
      shipped: "Truck",
      delivered: "CheckCircle2",
    };
    return icons[status as keyof typeof icons];
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "Администратор",
      text: messageInput,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      type: "text",
      isAdmin: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput("");
    toast.success("Сообщение отправлено");
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
      toast.error("Заполните все поля");
      return;
    }
    
    const product: Product = {
      id: Math.max(...products.map(p => p.id)) + 1,
      ...newProduct
    };
    
    setProducts([...products, product]);
    setNewProduct({ name: "", price: 0, category: "", image: "📦" });
    setIsAddDialogOpen(false);
    toast.success("Товар добавлен");
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;
    
    setProducts(products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    toast.success("Товар обновлен");
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Товар удален");
  };

  const handleSendSupportReply = () => {
    if (!supportReply.trim() || !selectedTicket) return;
    
    const newMessage: Message = {
      id: selectedTicket.messages.length + 1,
      sender: "Администратор",
      text: supportReply,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      type: "text",
      isAdmin: true,
    };
    
    setSupportTickets(supportTickets.map(ticket =>
      ticket.id === selectedTicket.id
        ? { ...ticket, messages: [...ticket.messages, newMessage], status: 'active' }
        : ticket
    ));
    
    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      status: 'active'
    });
    
    setSupportReply("");
    toast.success("Ответ отправлен клиенту");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center animate-scale-in">
                <Icon name="Store" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ShopAdmin Pro</h1>
                <p className="text-xs text-gray-500">Панель управления</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Icon name="Bell" size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse-soft">
                    {notifications}
                  </span>
                )}
              </Button>
              
              <Avatar className="h-9 w-9 border-2 border-blue-100">
                <AvatarFallback className="bg-blue-500 text-white">АД</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 bg-white p-2 rounded-xl shadow-sm">
            <TabsTrigger value="catalog" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
              <Icon name="Grid3x3" size={18} className="mr-2" />
              Каталог
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
              <Icon name="ShoppingBag" size={18} className="mr-2" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
              <Icon name="CreditCard" size={18} className="mr-2" />
              Платежи
            </TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
              <Icon name="Users" size={18} className="mr-2" />
              Сотрудники
            </TabsTrigger>
            <TabsTrigger value="delivery" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
              <Icon name="Truck" size={18} className="mr-2" />
              Доставка
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all relative">
              <Icon name="Bell" size={18} className="mr-2" />
              Уведомления
              {notifications > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {notifications}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
              <Icon name="MessageSquare" size={18} className="mr-2" />
              Поддержка
            </TabsTrigger>
          </TabsList>

          {/* Catalog Tab */}
          <TabsContent value="catalog" className="animate-fade-in">
            <div className="mb-6">
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-500 hover:bg-blue-600">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить товар
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in border-2 border-transparent hover:border-blue-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="text-6xl mb-4 text-center">{product.image}</div>
                  <Badge className="mb-2 bg-blue-100 text-blue-800 border-blue-200">{product.category}</Badge>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{product.name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-4">{product.price.toLocaleString()} ₽</p>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Icon name="Edit" size={18} className="mr-2" />
                      Изменить
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="animate-fade-in">
            <div className="space-y-4">
              {orders.map((order, index) => (
                <Card 
                  key={order.id} 
                  className="p-6 hover:shadow-lg transition-all animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">Заказ #{order.id}</h3>
                        <Badge className={`${getStatusColor(order.status)} border`}>
                          <Icon name={getStatusIcon(order.status)} size={14} className="mr-1" />
                          {order.status === 'pending' && 'Ожидает'}
                          {order.status === 'processing' && 'В обработке'}
                          {order.status === 'shipped' && 'Отправлен'}
                          {order.status === 'delivered' && 'Доставлен'}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{order.product}</p>
                      <p className="text-sm text-gray-500">Клиент: {order.customer}</p>
                    </div>
                    <span className="text-sm text-gray-500">{order.date}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Прогресс доставки</span>
                      <span className="font-semibold text-blue-600">{order.progress}%</span>
                    </div>
                    <Progress value={order.progress} className="h-2" />
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Icon name="Eye" size={16} className="mr-2" />
                      Детали
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Icon name="MessageSquare" size={16} className="mr-2" />
                      Написать
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="animate-fade-in">
            <div className="grid gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="CreditCard" size={20} />
                  Привязанные карты
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                    <div>
                      <p className="text-sm opacity-80">MasterCard</p>
                      <p className="font-mono text-lg">•••• 4242</p>
                    </div>
                    <Icon name="CreditCard" size={32} />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить карту
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} />
                  Последние транзакции
                </h3>
                <div className="space-y-3">
                  {[
                    { id: 1, name: "Оплата заказа #101", amount: 79990, date: "8 янв, 14:30" },
                    { id: 2, name: "Оплата заказа #102", amount: 12990, date: "8 янв, 12:15" },
                    { id: 3, name: "Возврат #98", amount: -24990, date: "7 янв, 18:20" },
                  ].map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.name}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                      <span className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} ₽
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="animate-fade-in">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Users" size={20} />
                  Команда
                </h3>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {employees.map((employee) => (
                      <div
                        key={employee.id}
                        onClick={() => setSelectedEmployee(employee)}
                        className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${
                          selectedEmployee?.id === employee.id ? 'bg-blue-100 border-2 border-blue-300' : 'border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarFallback className={employee.online ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'}>
                                {employee.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              employee.online ? 'bg-green-500 animate-pulse-soft' : 'bg-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900">{employee.name}</p>
                            <p className="text-xs text-gray-500 truncate">{employee.role}</p>
                            {employee.lastMessage && (
                              <p className="text-xs text-gray-400 truncate mt-1">{employee.lastMessage}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>

              <Card className="lg:col-span-2 p-4 flex flex-col">
                {selectedEmployee ? (
                  <>
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <Avatar>
                        <AvatarFallback className="bg-blue-500 text-white">
                          {selectedEmployee.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{selectedEmployee.name}</h3>
                        <p className="text-sm text-gray-500">{selectedEmployee.role}</p>
                      </div>
                      <Badge className={selectedEmployee.online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {selectedEmployee.online ? '🟢 Онлайн' : '⚫ Не в сети'}
                      </Badge>
                    </div>

                    <ScrollArea className="flex-1 py-4 h-[480px]">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${message.isAdmin ? 'flex-row-reverse' : ''} animate-fade-in`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={message.isAdmin ? 'bg-blue-500 text-white' : 'bg-gray-300'}>
                                {message.sender[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`flex-1 max-w-[70%] ${message.isAdmin ? 'items-end' : ''}`}>
                              <div className={`rounded-2xl p-3 ${
                                message.isAdmin 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100 text-gray-900'
                              }`}>
                                {message.type === 'voice' && (
                                  <div className="flex items-center gap-2">
                                    <Icon name="Mic" size={16} />
                                    <div className="flex-1 h-1 bg-white/30 rounded-full" />
                                  </div>
                                )}
                                <p className="text-sm">{message.text}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 px-2">{message.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Icon name="Paperclip" size={18} />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Icon name="Image" size={18} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => toast.success("🎤 Запись голосового сообщения")}
                        >
                          <Icon name="Mic" size={18} />
                        </Button>
                        <Input
                          placeholder="Введите сообщение..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600">
                          <Icon name="Send" size={18} />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Icon name="MessageSquare" size={48} className="mx-auto mb-2 opacity-50" />
                      <p>Выберите сотрудника для начала чата</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="animate-fade-in">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Icon name="MapPin" size={20} />
                Активные доставки
              </h3>
              <div className="space-y-4">
                {orders.filter(o => o.status === 'shipped').map((order) => (
                  <div key={order.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">Заказ #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">
                        <Icon name="Truck" size={14} className="mr-1 animate-pulse-soft" />
                        В пути
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon name="MapPin" size={16} className="text-blue-500" />
                        <span>г. Москва, ул. Тверская, д. 12</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon name="Clock" size={16} className="text-blue-500" />
                        <span>Ожидаемое время: 14:00 - 16:00</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Progress value={order.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Склад</span>
                        <span className="font-semibold text-blue-600">{order.progress}%</span>
                        <span>Адрес доставки</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="animate-fade-in">
            <Card className="p-6">
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-24 w-24 border-4 border-blue-100">
                  <AvatarFallback className="bg-blue-500 text-white text-2xl">АД</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Администратор</h3>
                  <p className="text-gray-600 dark:text-gray-400">admin@shopadmin.ru</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Icon name="Edit" size={16} className="mr-2" />
                    Редактировать профиль
                  </Button>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name={isDarkMode ? "Moon" : "Sun"} size={24} className="text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Темная тема</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Переключить цветовую схему</p>
                    </div>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Icon name="ShoppingBag" size={24} className="text-blue-500 mb-2" />
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">247</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Заказов обработано</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Icon name="TrendingUp" size={24} className="text-green-500 mb-2" />
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">2.4M ₽</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Общая выручка</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Icon name="Users" size={24} className="text-purple-500 mb-2" />
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">156</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Активных клиентов</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Icon name="Star" size={24} className="text-orange-500 mb-2" />
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">4.8</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Средний рейтинг</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="animate-fade-in">
            <div className="space-y-3">
              {[
                { id: 1, type: "order", title: "Новый заказ #105", desc: "Заказ от Петр Смирнов на 54990 ₽", time: "2 мин назад", unread: true },
                { id: 2, type: "payment", title: "Оплата получена", desc: "Заказ #101 оплачен успешно", time: "15 мин назад", unread: true },
                { id: 3, type: "message", title: "Новое сообщение", desc: "Анна Волкова: Клиент запросил замену", time: "1 час назад", unread: true },
                { id: 4, type: "delivery", title: "Заказ доставлен", desc: "Заказ #98 успешно доставлен", time: "3 часа назад", unread: false },
              ].map((notif) => (
                <Card 
                  key={notif.id} 
                  className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                    notif.unread ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
                  }`}
                  onClick={() => {
                    if (notif.unread) {
                      setNotifications(prev => Math.max(0, prev - 1));
                      toast.success("Уведомление прочитано");
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      notif.type === 'order' ? 'bg-blue-100' :
                      notif.type === 'payment' ? 'bg-green-100' :
                      notif.type === 'message' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      <Icon 
                        name={
                          notif.type === 'order' ? 'ShoppingBag' :
                          notif.type === 'payment' ? 'DollarSign' :
                          notif.type === 'message' ? 'MessageSquare' :
                          'Truck'
                        } 
                        size={20}
                        className={
                          notif.type === 'order' ? 'text-blue-600' :
                          notif.type === 'payment' ? 'text-green-600' :
                          notif.type === 'message' ? 'text-purple-600' :
                          'text-orange-600'
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{notif.title}</p>
                      <p className="text-sm text-gray-600">{notif.desc}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                    {notif.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-soft" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="animate-fade-in">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Headphones" size={20} />
                  Обращения
                </h3>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {supportTickets.map((ticket) => (
                      <div 
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedTicket?.id === ticket.id 
                            ? 'bg-blue-100 border-2 border-blue-300' 
                            : ticket.status === 'active' ? 'border-2 border-green-200 bg-green-50' :
                              ticket.status === 'waiting' ? 'border-2 border-yellow-200 bg-yellow-50' :
                              'border-2 border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-500 text-white">{ticket.client[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-sm text-gray-900">{ticket.client}</p>
                              <Badge className={
                                ticket.status === 'active' ? 'bg-green-100 text-green-800' :
                                ticket.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {ticket.status === 'active' ? '🟢' :
                                 ticket.status === 'waiting' ? '🟡' : '✅'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{ticket.issue}</p>
                            <p className="text-xs text-gray-500 mt-1">{ticket.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>

              <Card className="lg:col-span-2 p-4 flex flex-col">
                {selectedTicket ? (
                  <>
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <Avatar>
                        <AvatarFallback className="bg-blue-500 text-white">
                          {selectedTicket.client[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{selectedTicket.client}</h3>
                        <p className="text-sm text-gray-500">{selectedTicket.issue}</p>
                      </div>
                      <Badge className={
                        selectedTicket.status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedTicket.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {selectedTicket.status === 'active' ? '🟢 Активно' :
                         selectedTicket.status === 'waiting' ? '🟡 Ожидает' :
                         '✅ Решено'}
                      </Badge>
                    </div>

                    <ScrollArea className="flex-1 py-4 h-[480px]">
                      <div className="space-y-4">
                        {selectedTicket.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${message.isAdmin ? 'flex-row-reverse' : ''} animate-fade-in`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={message.isAdmin ? 'bg-blue-500 text-white' : 'bg-gray-300'}>
                                {message.sender[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`flex-1 max-w-[70%] ${message.isAdmin ? 'items-end' : ''}`}>
                              <div className={`rounded-2xl p-3 ${
                                message.isAdmin 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100 text-gray-900'
                              }`}>
                                <p className="text-sm">{message.text}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 px-2">{message.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="pt-4 border-t">
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Введите ответ клиенту..."
                          value={supportReply}
                          onChange={(e) => setSupportReply(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSendSupportReply} 
                            className="flex-1 bg-blue-500 hover:bg-blue-600"
                          >
                            <Icon name="Send" size={18} className="mr-2" />
                            Отправить ответ
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setSupportTickets(supportTickets.map(t =>
                                t.id === selectedTicket.id ? { ...t, status: 'resolved' } : t
                              ));
                              setSelectedTicket({ ...selectedTicket, status: 'resolved' });
                              toast.success("Обращение закрыто");
                            }}
                          >
                            <Icon name="CheckCircle2" size={18} className="mr-2" />
                            Закрыть
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Icon name="Headphones" size={48} className="mx-auto mb-2 opacity-50" />
                      <p>Выберите обращение для ответа</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить товар</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Название товара</Label>
              <Input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Например: Смартфон XYZ"
              />
            </div>
            <div>
              <Label>Цена (₽)</Label>
              <Input
                type="number"
                value={newProduct.price || ''}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Категория</Label>
              <Input
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                placeholder="Например: Электроника"
              />
            </div>
            <div>
              <Label>Эмодзи товара</Label>
              <Input
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                placeholder="📦"
                maxLength={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddProduct} className="bg-blue-500 hover:bg-blue-600">
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать товар</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label>Название товара</Label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Цена (₽)</Label>
                <Input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Категория</Label>
                <Input
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                />
              </div>
              <div>
                <Label>Эмодзи товара</Label>
                <Input
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  maxLength={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditProduct} className="bg-blue-500 hover:bg-blue-600">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;