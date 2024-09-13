

def main():
    
    x=[]
    y=[]
    list=[]
    n=int(input("Enter the Number : "))
    list.append(n)
    for i in list:
        if i%2==0:
            i=i/2
            print(i)
            list.append(i)
        elif i==1:
            print("Infinite Loop")
            break
        else:
            i=(3*i)+1
            print(i)
            list.append(i)
    
    for i in range(len(list)):
        x.append(list[i])
        y.append(list[i])
    plt.plot(x)
    plt.show()
            
if __name__=="__main__":
	main()